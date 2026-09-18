"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { EyeIcon, FilterIcon, SearchIcon, TrashIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Alert, Button, CircularProgress, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { MenusTabProps } from "./";
import { IMenu, mapApiCardapio } from "@/Interfaces/Menu/menu";
import MenuItemCard from "./MenuItemCard";
import { menuColumns } from "@/data/tableColumns";
import Select from "@/components/FormControl/Select";
import ViewMenuModal from "@/components/Modals/ViewMenuModal";
import { ActionModal } from "@/components/Modals/ActionModal/component";
import { formatDateOnly } from "@/utils/formatDate";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";

const STATUS_OPTIONS = [
  { label: "Todos os status", value: "" },
  { label: "Planejado", value: "planejado" },
  { label: "Confirmado", value: "confirmado" },
  { label: "Servido", value: "servido" },
];

export function MenusTab({ }: MenusTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();
  const [openDeleteMenuModal, setOpenDeleteMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [menus, setMenus] = React.useState<IMenu[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    control,
    watch
  } = useForm<{ menuSearch: string; unidade: string; tipo: string; status: string }>({
    defaultValues: {
      menuSearch: "",
      unidade: "all",
      tipo: "",
      status: "",
    },
  });

  const filters = watch();
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(
    filters.unidade !== "all" ? filters.unidade : undefined,
  );
  const debouncedSearch = useDebounce(filters.menuSearch, 500);

  const loadMenus = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.unidade && filters.unidade !== "all") params.set("unidade", filters.unidade);
      if (filters.tipo) params.set("tipo_refeicao", filters.tipo);
      if (filters.status) params.set("status", filters.status);
      if (debouncedSearch) params.set("unidade_nome", debouncedSearch);
      params.set("page_size", "200");

      const response = await fetch(`/api/cardapio?${params}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Erro ao carregar cardápios");
      }
      const results = Array.isArray(payload.results) ? payload.results : [];
      setMenus(results.map(mapApiCardapio));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar cardápios");
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.unidade, filters.tipo, filters.status, debouncedSearch]);

  React.useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleDelete = async () => {
    if (!selectedMenu || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/cardapio/${selectedMenu.id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Erro ao excluir cardápio" }));
        throw new Error(payload.message || "Erro ao excluir cardápio");
      }
      setOpenDeleteMenuModal(false);
      await loadMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir cardápio");
    } finally {
      setIsDeleting(false);
    }
  };

  const recentMenus = menus.slice(0, 8);

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
            placeholder="Buscar por unidade..."
            icon={<SearchIcon />}
            register={register("menuSearch")}
          />
          <Select
            options={unitOptions}
            name="unidade"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={[{ label: "Todos os tipos", value: "" }, ...tipoRefeicaoOptions.filter((o) => o.value !== "")]}
            name="tipo"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
          <Select
            options={STATUS_OPTIONS}
            name="status"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ fontWeight: "400", minWidth: "120px" }}
            onClick={() => loadMenus()}
          >
            Filtrar
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {isLoading ? (
          <Stack alignItems="center" padding={4}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Stack
            gap={2}
            direction={{ xs: "column", sm: "row" }}
            sx={{ overflowX: "auto", paddingBottom: 1, marginBottom: -1 }}
          >
            {recentMenus.length === 0 && (
              <Typography variant="body2" color="text.secondary">Nenhum cardápio encontrado.</Typography>
            )}
            {recentMenus.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onChanged={loadMenus}
              />
            ))}
          </Stack>
        )}

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
          rows={menus}
          initialRowsPerPage={5}
          isLoading={isLoading}
        />
      </Card>

      {
        openViewMenuModal && selectedMenu &&
        <ViewMenuModal
          isOpen={openViewMenuModal}
          onClose={() => setOpenViewMenuModal(false)}
          cardapioId={selectedMenu.id}
          onChanged={loadMenus}
        />
      }

      {
        openDeleteMenuModal && selectedMenu && (
          <ActionModal
            open={openDeleteMenuModal}
            onCancel={() => setOpenDeleteMenuModal(false)}
            onConfirm={handleDelete}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o cardápio da data "${formatDateOnly(selectedMenu.dataRefeicao)}", deseja continuar?`}
            confirmLabel={isDeleting ? "Excluindo..." : "Confirmar"}
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </React.Fragment>
  );
}
