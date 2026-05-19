"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { EyeIcon, SearchIcon, TrashIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { MenusTabProps } from "./interface";
import { Cardapio, StatusCardapio } from "@/types/cardapio";
import { IMenu, IMenuItems } from "@/Interfaces/Menu/menu";
import MenuItemCard from "./MenuItemCard";
import { menuColumns } from "@/data/tableColumns";
import Select from "@/components/FormControl/Select";
import ViewMenuModal from "@/components/Modals/ViewMenuModal";
import { ActionModal } from "@/components/Modals/ActionModal/component";
import { formatDateOnly } from "@/utils/formatDateOnly";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";

export function MenusTab({ periodFilter }: MenusTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();

  
  const [fetchedCardapios, setFetchedCardapios] = React.useState<IMenu[]>([]);
  const [isLoadingCardapios, setIsLoadingCardapios] = React.useState(false);
  const [cardapiosError, setCardapiosError] = React.useState<string | null>(null);
  const [mealTypeOptions, setMealTypeOptions] = React.useState<
    { label: string; value: string }[]
  >([{ label: "Todos os tipos", value: "all" }]);

  const [openDeleteMenuModal, setOpenDeleteMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu | null>(null);

  const {
    register,
    watch,
  } = useForm<{ menuSearch: string; unidade: string; tipos: string }>({
    defaultValues: {
      menuSearch: "",
      unidade: "all",
      tipos: "all",
    },
  });

  const menuSearch = watch("menuSearch");
  const unidade = watch("unidade");
  const tipos = watch("tipos");
  const debouncedMenuSearch = useDebounce(menuSearch, 300);

  React.useEffect(() => {
    async function loadMealTypes() {
      try {
        const response = await fetch("/api/tipo-refeicao");
        if (!response.ok) return;

        const payload = await response.json();
        const items = normalizeArrayPayload<{ id?: number; nome?: string }>(payload);

        setMealTypeOptions([
          { label: "Todos os tipos", value: "all" },
          ...items
            .map((item) => ({
              label: item.nome ?? `Tipo ${item.id ?? "?"}`,
              value: String(item.id ?? ""),
            }))
            .filter((item) => item.value),
        ]);
      } catch {
        
      }
    }

    loadMealTypes();
  }, []);

  function normalizeArrayPayload<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];

    if (payload && typeof payload === "object") {
      const root = payload as { results?: unknown; items?: unknown; data?: unknown };

      if (Array.isArray(root.results)) return root.results as T[];
      if (Array.isArray(root.items)) return root.items as T[];

      if (root.data && typeof root.data === "object") {
        const data = root.data as { results?: unknown; items?: unknown };
        if (Array.isArray(data.results)) return data.results as T[];
        if (Array.isArray(data.items)) return data.items as T[];
      }
    }

    return [];
  }

  const normalizeCardapio = React.useCallback((cardapio: Cardapio): IMenu => {
    const mapStatus = (status: StatusCardapio): IMenu["status"] => {
      const statusLower = String(status).toLowerCase();
      switch (statusLower) {
        case "publicado":
          return "ativo";
        case "planejado":
          return "programado";
        case "rascunho":
          return "programado";
        case "cancelado":
          return "finalizado";
        case "servido":
          return "finalizado";
        default:
          return "programado";
      }
    };

    return {
      id: cardapio.id,
      tipoIntervalo: "personalizado",
      data: cardapio.data_refeicao,
      unidade: cardapio.unidade_nome,
      tipo: cardapio.tipo_refeicao_nome,
      horario: {
        inicio: "--:--",
        fim: "--:--",
      },
      refeicoes: cardapio.pratos.map((prato) => ({
        id: prato.id,
        categoria: (prato.tipo_prato_display || "prato principal") as IMenuItems["categoria"],
        nome: prato.nome,
        descricao: prato.descricao,
        restricoes: [],
        status: "ativo",
      })),
      status: mapStatus(cardapio.status),
      observacao: cardapio.observacoes,
    };
  }, []);

  React.useEffect(() => {
    const loadCardapios = async () => {
      setIsLoadingCardapios(true);
      setCardapiosError(null);

      try {
        const params = new URLSearchParams();

        if (unidade && unidade !== "all") {
          params.set("unidade", unidade);
        }

        const tipoRefeicao = Number(tipos);
        if (
          !Number.isNaN(tipoRefeicao) &&
          Number.isInteger(tipoRefeicao) &&
          tipoRefeicao > 0
        ) {
          params.set("tipo_refeicao", String(tipoRefeicao));
        }
        
        if (
          periodFilter?.start &&
          periodFilter?.end &&
          !periodFilter.start.isAfter(periodFilter.end)
        ) {
          params.set("data_refeicao_after", periodFilter.start.format("YYYY-MM-DD"));
          params.set("data_refeicao_before", periodFilter.end.format("YYYY-MM-DD"));
        }

        const search = debouncedMenuSearch.trim();
        if (search) {
          params.set("search", search);
        }

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await fetch(`/api/cardapio${queryString}`);

        if (!response.ok) {
          const payload = await response
            .json()
            .catch(() => ({ message: "Erro ao buscar cardápios" }));
          throw new Error(payload.message ?? "Erro ao buscar cardápios");
        }

        const payload = await response.json();
        const apiItems = Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload?.items)
            ? payload.items
            : Array.isArray(payload?.data?.items)
              ? payload.data.items
              : Array.isArray(payload?.data?.results)
                ? payload.data.results
                : [];
        
        
        setFetchedCardapios(apiItems.map(normalizeCardapio));
      } catch (err) {
        setCardapiosError(err instanceof Error ? err.message : "Erro ao buscar cardápios");
        setFetchedCardapios([]);
      } finally {
        setIsLoadingCardapios(false);
      }
    };

    loadCardapios();
    
  }, [unidade, tipos, normalizeCardapio, periodFilter, debouncedMenuSearch]); 

  return (
    <React.Fragment>
      <Stack
        gap={0}
        padding={{ xs: 1, md: 3 }}
        spacing={2}
        border="1px solid"
        borderColor="divider"
        borderRadius={2}
        bgcolor="background.paper"
      >
        <Stack gap={{ xs: 1, sm: 2 }} direction={"row"}>
          <Input
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("menuSearch")}
          />
          <Select
            options={unitOptions}
            register={register("unidade")}
            defaultValue="all"
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mealTypeOptions}
            register={register("tipos")}
            defaultValue="all"
            formControlSx={{ maxWidth: "250px" }}
          />
        </Stack>

        <Stack
          gap={2}
          direction={{ xs: "column", sm: "row" }}
          sx={{ overflowX: "auto", paddingBottom: 1, marginBottom: -1 }}
        >
          {}
          {fetchedCardapios.map((item, i) => (
            <MenuItemCard
              key={`${item.id}-${i}`}
              item={item}
            />
          ))}
        </Stack>

      </Stack >

      <Card>
        <Typography>Cardápios Recentes</Typography>

        <Table
          columns={menuColumns.map(col =>
            col.key === "acoes"
              ? {
                ...col,
                render: (row: IMenu) => (
                  <Stack direction={"row"} alignItems="center">
                    <Tooltip title="Visualizar cardápio" arrow>
                      <IconButton
                        aria-label="visualizar cardápio"
                        size="small"
                        onClick={() => {
                          setSelectedMenu(row);
                          setOpenViewMenuModal(true);
                        }}
                        sx={{
                          height: "fit-content",
                        }}
                      >
                        <EyeIcon width={20} color={theme.palette.primary.main} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar cardápio" arrow>
                      <IconButton
                        aria-label="deletar cardápio"
                        size="small"
                        onClick={() => {
                          setSelectedMenu(row);
                          setOpenDeleteMenuModal(true);
                        }}
                        sx={{
                          height: "fit-content",
                        }}
                      >
                        <TrashIcon width={20} color={theme.palette.error.contrastText} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ),
              }
              : col
          )}
          
          rows={fetchedCardapios}
          initialRowsPerPage={5}
          isLoading={isLoadingCardapios}
        />
        {cardapiosError && (
          <Typography variant="body2" color="error.main" mt={2}>
            {cardapiosError}
          </Typography>
        )}
      </Card>

      {
        openViewMenuModal && selectedMenu &&
        <ViewMenuModal
          isOpen={openViewMenuModal}
          onClose={() => setOpenViewMenuModal(false)}
          data={selectedMenu}
        />
      }

      {
        openDeleteMenuModal && selectedMenu && (
          <ActionModal
            open={openDeleteMenuModal}
            onCancel={() => setOpenDeleteMenuModal(false)}
            onConfirm={() => console.log("Menu deleted:", selectedMenu)}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o cardápio da data "${formatDateOnly(selectedMenu.data)}", deseja continuar?`}
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </React.Fragment>
  );
}
