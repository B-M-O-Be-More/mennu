"use client";

import { Stack, Typography, Box, Button, Alert, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  AlertIcon,
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
import IconBox from "../Cards/IconBox";
import NewStockModal from "../Modals/NewStockModal";
import ActionCell from "../ActionCell";
import EditStockModal from "../Modals/EditStockModal";
import NewMovementModal from "../Modals/NewMovementModal";
import { useForm } from "react-hook-form";
import { IStock, IStockData } from "@/Interfaces/Stock/stock";
import { IMovement } from "@/Interfaces/Movement/movement";
import PageHeader from "../PageHeader";
import { useDebounce } from "@/hooks/useDebounce/hook";

export function StockPage({}: StockPageProps) {
  const [openTab, setOpenTab] = React.useState(0);

  const [openEditStockModal, setOpenEditStockModal] = React.useState(false);
  const [openNewStockModal, setOpenNewStockModal] = React.useState(false);
  const [openNewMovementModal, setOpenNewMovementModal] = React.useState(false);

  const [selectedStock, setSelectedStock] = React.useState<IStock | null>(null);
  const [stockData, setStockData] = useState<IStockData>({
    results: [],
    resumo: { total_ativos: 0, itens_criticos: 0, movimentacoes: 0 },
  });
  const [movementData, setMovementData] = useState<IMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(stockData);

  const { register, watch } = useForm<{ itemSearch: string }>({
    defaultValues: { itemSearch: "" },
  });

  const searchTerm = watch("itemSearch");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadStockData = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search
        ? `/api/insumo?search=${encodeURIComponent(search)}`
        : "/api/insumo";
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro ${response.status}: ${errData.message}`);
      }
      const data = await response.json();
      setStockData({
        results: Array.isArray(data) ? data : (data.results ?? []),
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
  };

  const loadMovementData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/movimentacao-estoque");
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro ${response.status}: ${errData.message}`);
      }
      const data = await response.json();
      setMovementData(data.results ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openTab === 0) {
      loadStockData(debouncedSearch);
    } else {
      loadMovementData();
    }
  }, [openTab, debouncedSearch]);

  const handleEditStock = (stock: IStock) => {
    setSelectedStock(stock);
    setOpenEditStockModal(true);
  };

  const handleSaveStock = () => {
    loadStockData(debouncedSearch);
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
          onClick={() =>
            openTab === 0 ? loadStockData(debouncedSearch) : loadMovementData()
          }
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

      <Stack gap={2} direction="row">
        <Button
          variant={openTab === 0 ? "contained" : "outlined"}
          startIcon={<EstoqueIcon width={22} height={22} />}
          onClick={() => setOpenTab(0)}
          sx={{
            transition: "all .4s ease-in-out",
            color: openTab === 1 ? "#4A5565" : "",
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
            color: openTab === 0 ? "#4A5565" : "",
          }}
        >
          Movimentações
        </Button>
      </Stack>

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
          <Typography variant="h4" fontWeight={400} color="text.primary">
            {stockData.resumo.itens_criticos}
          </Typography>
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

      <Card>
        {openTab === 0 ? (
          <React.Fragment>
            {error && <Alert severity="error">{error}</Alert>}

            <Stack
              direction="row"
              justifyContent="space-between"
              gap={2}
              alignItems="center"
            >
              <Typography>Itens Cadastrados</Typography>
              <Stack direction="row" gap={2} minWidth="450px">
                <Input
                  placeholder="Buscar item..."
                  icon={<SearchIcon />}
                  register={register("itemSearch")}
                />
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={() => setOpenNewStockModal(true)}
                  sx={{
                    height: "50px",
                    whiteSpace: "nowrap",
                    paddingX: "2rem",
                  }}
                >
                  Novo Item
                </Button>
                <NewStockModal
                  open={openNewStockModal}
                  onClose={() => {
                    setOpenNewStockModal(false);
                    loadStockData(debouncedSearch);
                  }}
                />
              </Stack>
            </Stack>

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
              rows={stockData.results}
              initialRowsPerPage={5}
              isLoading={loading}
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
              direction="row"
              justifyContent="space-between"
              gap={2}
              alignItems="center"
            >
              <Typography>Histórico de Movimentações</Typography>
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={() => setOpenNewMovementModal(true)}
                sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
              >
                Nova Movimentação
              </Button>
              <NewMovementModal
                open={openNewMovementModal}
                onClose={() => setOpenNewMovementModal(false)}
                onSave={loadMovementData}
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
    </Stack>
  );
}
