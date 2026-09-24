"use client";

import {
  Stack,
  Typography,
  Box,
  Button,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  CardActionArea,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  AlertIcon,
  ArrowIcon,
  CheckIcon,
  DownloadIcon,
  EstoqueIcon,
  PaperIcon,
  PlusIcon,
  SearchIcon,
  TwistedArrowIcon,
  UpdateIcon,
} from "../Icons";
import { StockPageProps } from "./";
import Card from "../Cards/Card";
import Table from "../Tables/Table";
import { movementColumns, stockColumns } from "@/data/tableColumns";
import Input from "../FormControl/Input";
import Select from "../FormControl/Select";
import IconBox from "../Cards/IconBox";
import NewStockModal from "../Modals/NewStockModal";
import ActionCell from "../ActionCell";
import EditStockModal from "../Modals/EditStockModal";
import NewMovementModal from "../Modals/NewMovementModal";
import TransferStockModal from "../Modals/TransferStockModal";
import { useForm } from "react-hook-form";
import { IStock, IStockData } from "@/Interfaces/Stock/stock";
import { mapApiSaldoEstoqueConsolidado } from "@/Interfaces/Stock/saldoEstoque";
import { IMovement, mapApiMovement } from "@/Interfaces/Movement/movement";
import PageHeader from "../PageHeader";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import TabButton from "../TabButton";
import StockAuditPanel from "./StockAuditPanel";
import StockBalancePanel from "./StockBalancePanel";
import Can from "@/components/Can";
import { useSearchParams } from "next/navigation";

/** Sub-abas da aba "Movimentações" — Auditoria já vem selecionada. */
const MOVEMENT_TABS = { auditoria: 0, historico: 1 } as const;

/** Abas principais da tela de estoque. */
const MAIN_TABS = { estoque: 0, movimentacoes: 1, saldo: 2 } as const;

type StockFilterState = {
  nome: "none" | "asc" | "desc";
  categoria: string;
  tipo_padrao: string;
  unidade_medida: string;
  quantidade_atual: "none" | "asc" | "desc";
  ativo: "all" | "active" | "inactive";
};

const EMPTY_STOCK_FILTERS: StockFilterState = {
  nome: "none",
  categoria: "all",
  tipo_padrao: "all",
  unidade_medida: "all",
  quantidade_atual: "none",
  ativo: "all",
};

const EMPTY_FILTER_VALUE = "__empty__";

const getNextSortDirection = (current: "none" | "asc" | "desc") => {
  if (current === "none") return "asc";
  if (current === "asc") return "desc";
  return "none";
};

const getStockOptions = (rows: IStock[], key: keyof IStock) => {
  const values = Array.from(
    new Set(rows.map((row) => String(row[key] ?? "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const hasEmpty = rows.some((row) => !String(row[key] ?? "").trim());
  return [
    ...(hasEmpty ? [{ value: EMPTY_FILTER_VALUE, label: "Sem preenchimento" }] : []),
    ...values.map((value) => ({ value, label: value })),
  ];
};

export function StockPage({}: StockPageProps) {
  const searchParams = useSearchParams();
  // `?tab=auditoria` abre direto a listagem de auditorias — é para onde a tela
  // de normalização devolve o usuário depois de normalizar o estoque.
  const startsOnAudit = searchParams.get("tab") === "auditoria";

  const [openTab, setOpenTab] = React.useState<typeof MAIN_TABS[keyof typeof MAIN_TABS]>(
    startsOnAudit ? MAIN_TABS.movimentacoes : MAIN_TABS.estoque,
  );
  const [movementTab, setMovementTab] = React.useState<number>(
    MOVEMENT_TABS.auditoria,
  );
  const [auditRefreshToken, setAuditRefreshToken] = React.useState(0);
  const [balanceRefreshToken, setBalanceRefreshToken] = React.useState(0);

  const [openEditStockModal, setOpenEditStockModal] = React.useState(false);
  const [openNewStockModal, setOpenNewStockModal] = React.useState(false);
  const [openNewMovementModal, setOpenNewMovementModal] = React.useState(false);
  const [openTransferStockModal, setOpenTransferStockModal] = React.useState(false);

  const [selectedStock, setSelectedStock] = React.useState<IStock | null>(null);
  const [stockData, setStockData] = useState<IStockData>({
    results: [],
    resumo: { total_ativos: 0, itens_criticos: 0, movimentacoes: 0 },
  });
  const [movementData, setMovementData] = useState<IMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, watch, control } = useForm<{ itemSearch: string; unidade: string }>({
    defaultValues: { itemSearch: "", unidade: "all" },
  });
  const { unitOptions } = useUnitFilterOptions();

  const searchTerm = watch("itemSearch");
  const unidadeFiltro = watch("unidade");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [stockFilters, setStockFilters] = React.useState<StockFilterState>(
    EMPTY_STOCK_FILTERS,
  );
  const [criticalOnly, setCriticalOnly] = React.useState(false);

  const updateStockFilter = React.useCallback(
    (updates: Partial<StockFilterState>) =>
      setStockFilters((previous) => ({ ...previous, ...updates })),
    [],
  );

  const clearStockFilter = React.useCallback(
    (key: keyof StockFilterState) =>
      updateStockFilter({
        [key]:
          key === "ativo" ||
          key === "categoria" ||
          key === "tipo_padrao" ||
          key === "unidade_medida"
            ? "all"
            : "none",
      } as Partial<StockFilterState>),
    [updateStockFilter],
  );

  const stockOptions = React.useMemo(
    () => ({
      categoria: getStockOptions(stockData.results, "categoria"),
      tipo_padrao: getStockOptions(stockData.results, "tipo_padrao"),
      unidade_medida: getStockOptions(stockData.results, "unidade_medida"),
    }),
    [stockData.results],
  );

  const filteredStockRows = React.useMemo(() => {
    const matchesOption = (value: unknown, selected: string) => {
      if (selected === "all") return true;
      if (selected === EMPTY_FILTER_VALUE) return !String(value ?? "").trim();
      return String(value ?? "").trim() === selected;
    };

    return stockData.results.filter((row) => {
      if (!matchesOption(row.categoria, stockFilters.categoria)) return false;
      if (!matchesOption(row.tipo_padrao, stockFilters.tipo_padrao)) return false;
      if (!matchesOption(row.unidade_medida, stockFilters.unidade_medida)) return false;
      if (stockFilters.ativo === "active" && !row.ativo) return false;
      if (stockFilters.ativo === "inactive" && row.ativo) return false;
      return true;
    }).toSorted((a, b) => {
      if (stockFilters.nome !== "none") {
        const comparison = String(a.nome ?? "").localeCompare(
          String(b.nome ?? ""),
          "pt-BR",
          { sensitivity: "base" },
        );
        return stockFilters.nome === "asc" ? comparison : -comparison;
      }
      if (stockFilters.quantidade_atual === "none") return 0;
      const aQuantity = Number(String(a.quantidade_atual ?? "").replace(",", "."));
      const bQuantity = Number(String(b.quantidade_atual ?? "").replace(",", "."));
      const aValue = Number.isFinite(aQuantity) ? aQuantity : 0;
      const bValue = Number.isFinite(bQuantity) ? bQuantity : 0;
      return stockFilters.quantidade_atual === "asc"
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [stockData.results, stockFilters]);

  const stockFilterResetKey = JSON.stringify({
    debouncedSearch,
    unidadeFiltro,
    criticalOnly,
    stockFilters,
  });

  const stockColumnFilters = React.useMemo(
    () => ({
      nome: {
        active: stockFilters.nome !== "none",
        ariaLabel: "Ordenar por nome",
        onToggle: () =>
          updateStockFilter({
            nome: getNextSortDirection(stockFilters.nome),
            quantidade_atual: "none",
          }),
        sortDirection:
          stockFilters.nome === "none" ? undefined : stockFilters.nome,
      },
      categoria: {
        active: stockFilters.categoria !== "all",
        ariaLabel: "Filtrar por categoria",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Categoria</InputLabel>
            <MuiSelect
              label="Categoria"
              value={stockFilters.categoria}
              onChange={(event) => updateStockFilter({ categoria: event.target.value })}
            >
              <MenuItem value="all">Todas</MenuItem>
              {stockOptions.categoria.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => clearStockFilter("categoria"),
      },
      tipo_padrao: {
        active: stockFilters.tipo_padrao !== "all",
        ariaLabel: "Filtrar por tipo padrão",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Tipo Padrão</InputLabel>
            <MuiSelect
              label="Tipo Padrão"
              value={stockFilters.tipo_padrao}
              onChange={(event) => updateStockFilter({ tipo_padrao: event.target.value })}
            >
              <MenuItem value="all">Todos</MenuItem>
              {stockOptions.tipo_padrao.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => clearStockFilter("tipo_padrao"),
      },
      unidade_medida: {
        active: stockFilters.unidade_medida !== "all",
        ariaLabel: "Filtrar por unidade de medida",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Unidade de Medida</InputLabel>
            <MuiSelect
              label="Unidade de Medida"
              value={stockFilters.unidade_medida}
              onChange={(event) => updateStockFilter({ unidade_medida: event.target.value })}
            >
              <MenuItem value="all">Todas</MenuItem>
              {stockOptions.unidade_medida.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => clearStockFilter("unidade_medida"),
      },
      quantidade_atual: {
        active: stockFilters.quantidade_atual !== "none",
        ariaLabel: "Ordenar por quantidade atual",
        onToggle: () =>
          updateStockFilter({
            quantidade_atual: getNextSortDirection(
              stockFilters.quantidade_atual,
            ),
            nome: "none",
          }),
        sortDirection:
          stockFilters.quantidade_atual === "none"
            ? undefined
            : stockFilters.quantidade_atual,
      },
      ativo: {
        active: stockFilters.ativo !== "all",
        ariaLabel: "Filtrar por status",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <MuiSelect
              label="Status"
              value={stockFilters.ativo}
              onChange={(event) => updateStockFilter({ ativo: event.target.value as StockFilterState["ativo"] })}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="active">Ativo</MenuItem>
              <MenuItem value="inactive">Inativo</MenuItem>
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => clearStockFilter("ativo"),
      },
    }),
    [clearStockFilter, stockFilters, stockOptions, updateStockFilter],
  );

  const loadStockData = React.useCallback(async (
    search?: string,
    unidadeId?: string,
    onlyCritical = false,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (unidadeId && unidadeId !== "all") {
        params.set("unidade_id", unidadeId);
      }
      if (onlyCritical) params.set("critico", "true");
      const query = params.toString();
      const url = `/api/insumo${query ? `?${query}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro ${response.status}: ${errData.message}`);
      }
      const data = await response.json();
      let results: IStock[] = Array.isArray(data) ? data : (data.results ?? []);

      // `quantidade_atual` do /insumo é o total agregado da empresa (soma de
      // todas as unidades) — com uma unidade selecionada, sobrepõe pelo saldo
      // real daquela unidade (/saldo-estoque/unidade/{id}). Insumo sem saldo
      // ali é 0, não "—": a ausência de linha significa estoque zerado nessa
      // unidade, não dado desconhecido.
      if (unidadeId && unidadeId !== "all") {
        const saldoResponse = await fetch(`/api/saldo-estoque/unidade/${unidadeId}`);
        if (saldoResponse.ok) {
          const saldoPayload = await saldoResponse.json();
          const saldoMap = new Map(
            (Array.isArray(saldoPayload) ? saldoPayload : [])
              .map(mapApiSaldoEstoqueConsolidado)
              .map((item) => [item.insumoId, item.quantidade]),
          );
          results = results.map((item) => ({
            ...item,
            quantidade_atual: saldoMap.get(item.id) ?? "0.00",
          }));
        }
      }

      setStockData({
        results,
        resumo: data.resumo ?? {
          total_ativos: 0,
          itens_criticos: 0,
          movimentacoes: 0,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMovementData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/movimentacao-estoque");
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro ${response.status}: ${errData.message}`);
      }
      const data = await response.json();
      const results = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
      setMovementData(results.map(mapApiMovement));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuditTab = openTab === 1 && movementTab === MOVEMENT_TABS.auditoria;

  useEffect(() => {
    if (openTab === 0) {
      loadStockData(debouncedSearch, unidadeFiltro, criticalOnly);
      return;
    }

    if (openTab === 1 && movementTab === MOVEMENT_TABS.historico) {
      loadMovementData();
    }
  }, [
    openTab,
    movementTab,
    debouncedSearch,
    unidadeFiltro,
    criticalOnly,
    loadStockData,
    loadMovementData,
  ]);

  const handleEditStock = (stock: IStock) => {
    setSelectedStock(stock);
    setOpenEditStockModal(true);
  };

  const handleSaveStock = () => {
    loadStockData(debouncedSearch, unidadeFiltro, criticalOnly);
  };

  const handleToggleStock = async (stock: IStock, newState: boolean) => {
    if (!stock.id) return;

    try {
      setError(null);
      const response = await fetch(`/api/insumo/${stock.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: newState }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        if (response.status === 403) {
          throw new Error(
            "Você não tem permissão para alterar o status deste insumo.",
          );
        }
        if (response.status === 404) {
          throw new Error("Insumo não encontrado.");
        }
        if (response.status === 409) {
          throw new Error(
            "Não foi possível alterar o status deste insumo no momento.",
          );
        }
        if (response.status >= 500) {
          throw new Error(
            "Erro no servidor ao alterar status. Tente novamente.",
          );
        }

        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao atualizar status" }));
        throw new Error(errData.message || "Erro ao atualizar status");
      }

      const responseData = await response.json().catch(() => null);
      const serverAtivo =
        responseData && typeof responseData.ativo === "boolean"
          ? responseData.ativo
          : newState;

      setStockData((prev) => ({
        ...prev,
        results: prev.results.map((item) =>
          item.id === stock.id ? { ...item, ativo: serverAtivo } : item,
        ),
      }));
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Falha de conexão. Verifique sua internet e tente novamente.");
        return;
      }
      setError(err instanceof Error ? err.message : "Erro ao atualizar status");
    }
  };

  return (
    <Stack gap={2}>
      <PageHeader title="Estoque" subtitle="Gerencie insumos e movimentações">
        <Button
          variant="outlined"
          startIcon={<UpdateIcon />}
          onClick={() => {
            if (openTab === 0) {
              return loadStockData(debouncedSearch, unidadeFiltro, criticalOnly);
            }
            if (openTab === 2) return setBalanceRefreshToken((token) => token + 1);
            if (isAuditTab) return setAuditRefreshToken((token) => token + 1);
            return loadMovementData();
          }}
        >
          Atualizar
        </Button>
        <Tooltip title="Em breve">
          <span>
            <Button variant="contained" startIcon={<DownloadIcon />} disabled>
              Exportar
            </Button>
          </span>
        </Tooltip>
      </PageHeader>

      <Stack gap={2} direction="row" flexWrap="wrap">
        <Button
          variant={openTab === 0 ? "contained" : "outlined"}
          startIcon={<EstoqueIcon width={22} height={22} />}
          onClick={() => setOpenTab(0)}
          sx={{
            transition: "all .4s ease-in-out",
            color: openTab !== 0 ? "#4A5565" : "",
          }}
        >
          Itens de Estoque
        </Button>
        <Button
          variant={openTab === 1 ? "contained" : "outlined"}
          startIcon={<PaperIcon width={22} height={22} />}
          onClick={() => setOpenTab(1)}
          sx={{
            transition: "all .4s ease-in-out",
            color: openTab !== 1 ? "#4A5565" : "",
          }}
        >
          Movimentações
        </Button>
        <Can permissions="estoque.view.saldo">
          <Button
            variant={openTab === 2 ? "contained" : "outlined"}
            startIcon={<TwistedArrowIcon width={22} height={22} />}
            onClick={() => setOpenTab(2)}
            sx={{
              transition: "all .4s ease-in-out",
              color: openTab !== 2 ? "#4A5565" : "",
            }}
          >
            Saldo de Estoque
          </Button>
        </Can>
      </Stack>

      {openTab === 1 && (
        <Stack gap={2} direction="row" flexWrap="wrap">
          <TabButton
            label="Auditoria"
            tabIndex={MOVEMENT_TABS.auditoria}
            activeTab={movementTab}
            onChange={setMovementTab}
          />
          <TabButton
            label="Histórico de movimentações"
            tabIndex={MOVEMENT_TABS.historico}
            activeTab={movementTab}
            onChange={setMovementTab}
          />
        </Stack>
      )}

      {/* Estes indicadores descrevem exclusivamente a listagem de insumos. */}
      {openTab === MAIN_TABS.estoque && (
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns="repeat(auto-fit, minmax(236px, 1fr))"
        >
          <Card spacing={0}>
            <Stack
              alignItems="center"
              direction="row"
              gap={2}
              justifyContent="space-between"
              width="100%"
            >
              <Box>
                <Typography color="text.primary" variant="body1" fontWeight={400}>
                  Total de Itens
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  fontWeight={400}
                >
                  Ativos no sistema
                </Typography>
              </Box>
              <IconBox
                icon={<EstoqueIcon color="#00A63E" />}
                bgColor={"#F0FDF4"}
              />
            </Stack>
            <Typography variant="h4" fontWeight={400} color="text.primary">
              {stockData.resumo.total_ativos}
            </Typography>
          </Card>
          <Card
            spacing={0}
            padding={0}
            sx={{
              overflow: "hidden",
              bgcolor: criticalOnly ? "error.main" : "background.paper",
            }}
          >
            <CardActionArea
              aria-label={
                criticalOnly
                  ? "Remover filtro de itens críticos"
                  : "Mostrar somente itens críticos"
              }
              aria-pressed={criticalOnly}
              onClick={() => setCriticalOnly((previous) => !previous)}
              sx={{
                alignItems: "stretch",
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 2,
                justifyContent: "space-between",
                p: { xs: 1, md: 3 },
                textAlign: "left",
                transition: "background-color 180ms ease",
                "&:hover": {
                  bgcolor: criticalOnly
                    ? "rgba(231, 0, 11, 0.08)"
                    : "error.main",
                },
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "error.contrastText",
                  outlineOffset: -2,
                },
              }}
            >
              <Stack
                alignItems="center"
                direction="row"
                gap={2}
                justifyContent="space-between"
                width="100%"
              >
                <Box>
                  <Typography color="text.primary" variant="body1" fontWeight={400}>
                    Itens Críticos
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    fontWeight={400}
                  >
                    Abaixo do mínimo
                  </Typography>
                </Box>
                <IconBox icon={<AlertIcon color="#E7000B" />} bgColor={"#FEF2F2"} />
              </Stack>
              <Typography variant="h4" fontWeight={400} color="text.primary" width="100%">
                {stockData.resumo.itens_criticos}
              </Typography>
              <Stack
                alignItems="center"
                color="error.contrastText"
                direction="row"
                gap={0.75}
                width="100%"
              >
                {criticalOnly ? (
                  <CheckIcon width={16} height={16} />
                ) : (
                  <ArrowIcon width={16} height={16} />
                )}
                <Typography color="inherit" variant="caption" fontWeight={600}>
                  {criticalOnly
                    ? "Filtro ativo — clique para remover"
                    : "Clique para ver os itens críticos"}
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
          <Card spacing={0}>
            <Stack
              alignItems="center"
              direction="row"
              gap={2}
              justifyContent="space-between"
              width="100%"
            >
              <Box>
                <Typography color="text.primary" variant="body1" fontWeight={400}>
                  Movimentações
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  fontWeight={400}
                >
                  Últimos 7 dias
                </Typography>
              </Box>
              <IconBox
                icon={<TwistedArrowIcon color="#155DFC" />}
                bgColor={"#FEF2F2"}
              />
            </Stack>
            <Typography variant="h4" fontWeight={400} color="text.primary">
              {stockData.resumo.movimentacoes}
            </Typography>
          </Card>
        </Box>
      )}

      {isAuditTab ? (
        <StockAuditPanel refreshToken={auditRefreshToken} />
      ) : openTab === 2 ? (
        <Can permissions="estoque.view.saldo" message="Você não tem permissão para ver o saldo de estoque.">
          <StockBalancePanel refreshToken={balanceRefreshToken} />
        </Can>
      ) : (
        <Card>
          {openTab === 0 ? (
            <React.Fragment>
              {error && <Alert severity="error">{error}</Alert>}

              <Stack
                direction={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                gap={2}
                alignItems={{ xs: "stretch", lg: "center" }}
              >
                <Typography>Itens Cadastrados</Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  gap={2}
                  flexWrap="nowrap"
                  alignItems="flex-start"
                  width="100%"
                  maxWidth={{ lg: "760px" }}
                >
                  <Box sx={{ flex: "1 1 auto", minWidth: 0, width: "100%" }}>
                    <Input
                      placeholder="Buscar item..."
                      icon={<SearchIcon />}
                      register={register("itemSearch")}
                    />
                  </Box>
                  <Can permissions="estoque.view.saldo">
                    <Box
                      sx={{
                        flex: { xs: "1 1 auto", sm: "0 0 clamp(160px, 24vw, 200px)" },
                        width: "100%",
                      }}
                    >
                      <Select
                        options={unitOptions}
                        name="unidade"
                        control={control}
                      />
                    </Box>
                  </Can>
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => setOpenNewStockModal(true)}
                    sx={{
                      flexShrink: 0,
                      height: "56px",
                      width: { xs: "100%", sm: "auto" },
                      whiteSpace: "nowrap",
                      paddingX: { xs: "2rem", sm: "1.5rem", md: "2rem" },
                    }}
                  >
                    Novo Item
                  </Button>
                  <NewStockModal
                    open={openNewStockModal}
                    onClose={() => {
                      setOpenNewStockModal(false);
                      loadStockData(debouncedSearch, unidadeFiltro, criticalOnly);
                    }}
                  />
                </Stack>
              </Stack>

              {unidadeFiltro !== "all" && (
                <Typography variant="body2" color="text.secondary">
                  Quantidade da unidade selecionada. Os totais dos cards acima são da empresa inteira.
                </Typography>
              )}

              <Table
                columns={stockColumns.map((col) =>
                  col.key === "acoes"
                    ? {
                        ...col,
                        render: (row: IStock) => (
                          <ActionCell
                            checked={row.ativo}
                            tooltipToggle="Ativar/Desativar item"
                            onToggle={(newState) =>
                              handleToggleStock(row, newState)
                            }
                            tooltipEdit="Editar item"
                            onEdit={() => handleEditStock(row)}
                          />
                        ),
                      }
                    : col,
                )}
                rows={filteredStockRows}
                initialRowsPerPage={5}
                isLoading={loading}
                pageResetKey={stockFilterResetKey}
                columnFilters={stockColumnFilters}
              />

              {selectedStock && (
                <EditStockModal
                  open={openEditStockModal}
                  onClose={() => {
                    setOpenEditStockModal(false);
                    setSelectedStock(null);
                  }}
                  stockItem={selectedStock}
                  onSave={handleSaveStock}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {error && <Alert severity="error">{error}</Alert>}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Typography>Histórico de Movimentações</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={() => setOpenTransferStockModal(true)}
                    sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
                  >
                    Transferir estoque
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => setOpenNewMovementModal(true)}
                    sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
                  >
                    Nova Movimentação
                  </Button>
                </Stack>
                <NewMovementModal
                  open={openNewMovementModal}
                  onClose={() => setOpenNewMovementModal(false)}
                  onSave={loadMovementData}
                />
                <TransferStockModal
                  open={openTransferStockModal}
                  onClose={() => setOpenTransferStockModal(false)}
                  onSave={() => {
                    loadMovementData();
                    loadStockData(debouncedSearch, unidadeFiltro, criticalOnly);
                  }}
                />
              </Stack>

              <Table
                columns={movementColumns}
                rows={movementData}
                initialRowsPerPage={5}
                isLoading={loading}
              />
            </React.Fragment>
          )}
        </Card>
      )}
    </Stack>
  );
}
