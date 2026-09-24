"use client";

import Card from "@/components/Cards/Card";
import DatePicker from "@/components/FormControl/DatePicker";
import { EyeIcon, TrashIcon } from "@/components/Icons";
import { ActionModal } from "@/components/Modals/ActionModal/component";
import ViewMenuModal from "@/components/Modals/ViewMenuModal";
import Table from "@/components/Tables/Table";
import { menuColumns } from "@/data/tableColumns";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { IMenu, mapApiCardapio } from "@/Interfaces/Menu/menu";
import { formatDateOnly } from "@/utils/formatDate";
import {
  Alert,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select as MuiSelect,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { MenusTabProps } from "./";
import MenuItemCard from "./MenuItemCard";

const STATUS_OPTIONS = [
  { label: "Todos os status", value: "" },
  { label: "Planejado", value: "planejado" },
  { label: "Confirmado", value: "confirmado" },
  { label: "Servido", value: "servido" },
];

type MenuFilters = {
  unidade: string;
  tipo: string;
  status: string;
};

const DEFAULT_MENU_FILTERS: MenuFilters = {
  unidade: "all",
  tipo: "",
  status: "",
};

type MenuFilterForm = MenuFilters & {
  dataAfter: Dayjs | null;
  dataBefore: Dayjs | null;
};

const DEFAULT_MENU_FILTER_FORM: MenuFilterForm = {
  ...DEFAULT_MENU_FILTERS,
  dataAfter: null,
  dataBefore: null,
};

type MenusResponse = {
  message?: string;
  metadados?: { total_results?: number };
  results?: unknown[];
};

const sortMenusByDate = (firstMenu: IMenu, secondMenu: IMenu) => {
  const dateComparison = dayjs(firstMenu.dataRefeicao).diff(
    dayjs(secondMenu.dataRefeicao),
    "day",
  );
  if (dateComparison !== 0) return dateComparison;

  const mealTypeComparison =
    firstMenu.tipoRefeicaoOrdem - secondMenu.tipoRefeicaoOrdem;
  if (mealTypeComparison !== 0) return mealTypeComparison;

  return secondMenu.id - firstMenu.id;
};

async function parseMenusResponse(response: Response): Promise<MenusResponse> {
  const payload = (await response.json()) as MenusResponse;
  if (!response.ok) {
    throw new Error(payload.message || "Erro ao carregar cardápios");
  }
  return payload;
}

export function MenusTab({}: MenusTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();
  const [openDeleteMenuModal, setOpenDeleteMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [upcomingMenus, setUpcomingMenus] = React.useState<IMenu[]>([]);
  const [tableMenus, setTableMenus] = React.useState<IMenu[]>([]);
  const [tableTotal, setTableTotal] = React.useState(0);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = React.useState(false);
  const [isLoadingTable, setIsLoadingTable] = React.useState(false);
  const [hasLoadedTable, setHasLoadedTable] = React.useState(false);
  const [upcomingError, setUpcomingError] = React.useState<string | null>(null);
  const [tableError, setTableError] = React.useState<string | null>(null);

  const { control, watch, setValue } = useForm<MenuFilterForm>({
    defaultValues: DEFAULT_MENU_FILTER_FORM,
  });

  const formFilters = watch();
  const dateAfter = formFilters.dataAfter;
  const dateBefore = formFilters.dataBefore;
  const dateAfterParam = dateAfter?.format("YYYY-MM-DD") ?? "";
  const dateBeforeParam = dateBefore?.format("YYYY-MM-DD") ?? "";
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(
    formFilters.unidade !== "all" ? formFilters.unidade : undefined,
  );

  const tableFilterQuery = React.useMemo(() => {
    const params = new URLSearchParams();
    if (formFilters.unidade && formFilters.unidade !== "all") {
      params.set("unidade", formFilters.unidade);
    }
    if (formFilters.tipo) {
      params.set("tipo_refeicao", formFilters.tipo);
    }
    if (formFilters.status) params.set("status", formFilters.status);
    if (dateAfterParam) params.set("data_refeicao_after", dateAfterParam);
    if (dateBeforeParam) params.set("data_refeicao_before", dateBeforeParam);
    return params.toString();
  }, [
    dateAfterParam,
    dateBeforeParam,
    formFilters.status,
    formFilters.tipo,
    formFilters.unidade,
  ]);

  const tableQueryKey = tableFilterQuery;
  const [tablePagination, setTablePagination] = React.useState({
    page: 0,
    rowsPerPage: 5,
    queryKey: tableQueryKey,
  });
  const tablePage =
    tablePagination.queryKey === tableQueryKey ? tablePagination.page : 0;

  const invalidDateRange = Boolean(
    dateAfter && dateBefore && dateAfter.isAfter(dateBefore, "day"),
  );

  const loadUpcomingMenus = React.useCallback(async (signal?: AbortSignal) => {
    setIsLoadingUpcoming(true);
    setUpcomingError(null);
    try {
      const params = new URLSearchParams();
      params.set("data_refeicao_after", dayjs().format("YYYY-MM-DD"));
      params.set("page", "1");
      // O endpoint ainda não oferece `ordering`. Como o filtro de data já
      // elimina o histórico, carregamos somente os futuros (até o limite da
      // API), ordenamos com dayjs e exibimos os oito mais próximos.
      params.set("page_size", "200");

      const response = await fetch(`/api/cardapio?${params}`, { signal });
      const payload = await parseMenusResponse(response);
      const menus = Array.isArray(payload.results)
        ? payload.results
            .map(mapApiCardapio)
            .toSorted(sortMenusByDate)
            .slice(0, 8)
        : [];
      setUpcomingMenus(menus);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setUpcomingError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar próximos cardápios",
      );
      setUpcomingMenus([]);
    } finally {
      if (!signal?.aborted) setIsLoadingUpcoming(false);
    }
  }, []);

  const loadTableMenus = React.useCallback(
    async (signal?: AbortSignal) => {
      if (invalidDateRange) {
        setTableError("A data inicial não pode ser posterior à data final.");
        setTableMenus([]);
        setTableTotal(0);
        setIsLoadingTable(false);
        setHasLoadedTable(true);
        return;
      }

      setIsLoadingTable(true);
      setTableError(null);
      try {
        const params = new URLSearchParams(tableFilterQuery);
        params.set("page", String(tablePage + 1));
        params.set("page_size", String(tablePagination.rowsPerPage));

        const response = await fetch(`/api/cardapio?${params}`, { signal });
        const payload = await parseMenusResponse(response);
        // A API pagina antes de responder e não expõe `ordering`; portanto,
        // preservamos a ordem global do servidor em vez de ordenar só esta
        // página e criar uma sequência incorreta entre páginas.
        const menus = Array.isArray(payload.results)
          ? payload.results.map(mapApiCardapio)
          : [];

        setTableMenus(menus);
        setTableTotal(payload.metadados?.total_results ?? menus.length);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setTableError(
          error instanceof Error ? error.message : "Erro ao carregar cardápios",
        );
        setTableMenus([]);
        setTableTotal(0);
      } finally {
        if (!signal?.aborted) {
          setIsLoadingTable(false);
          setHasLoadedTable(true);
        }
      }
    },
    [
      invalidDateRange,
      tableFilterQuery,
      tablePage,
      tablePagination.rowsPerPage,
    ],
  );

  const refreshMenus = React.useCallback(async () => {
    await Promise.all([loadUpcomingMenus(), loadTableMenus()]);
  }, [loadTableMenus, loadUpcomingMenus]);

  React.useEffect(() => {
    const controller = new AbortController();
    void loadUpcomingMenus(controller.signal);
    return () => controller.abort();
  }, [loadUpcomingMenus]);

  React.useEffect(() => {
    const controller = new AbortController();
    void loadTableMenus(controller.signal);
    return () => controller.abort();
  }, [loadTableMenus]);

  const handleDelete = async () => {
    if (!selectedMenu || isDeleting) return;
    setIsDeleting(true);
    setTableError(null);
    try {
      const response = await fetch(`/api/cardapio/${selectedMenu.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ message: "Erro ao excluir cardápio" }));
        throw new Error(payload.message || "Erro ao excluir cardápio");
      }
      setOpenDeleteMenuModal(false);
      await refreshMenus();
    } catch (error) {
      setTableError(
        error instanceof Error ? error.message : "Erro ao excluir cardápio",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const applyColumnFilter = React.useCallback(
    (key: "unidade" | "tipo" | "status", value: string) => {
      setValue(key, value);
      if (key === "unidade") setValue("tipo", "");
    },
    [setValue],
  );

  const tableColumnFilters = React.useMemo(
    () => ({
      dataRefeicao: {
        active: Boolean(dateAfter || dateBefore),
        ariaLabel: "Filtrar por período da refeição",
        content: (
          <Stack gap={2}>
            <DatePicker
              label="Data inicial"
              name="dataAfter"
              control={control}
              size="small"
              maxDate={dateBefore ?? undefined}
            />
            <DatePicker
              label="Data final"
              name="dataBefore"
              control={control}
              size="small"
              minDate={dateAfter ?? undefined}
            />
          </Stack>
        ),
        onClear: () => {
          setValue("dataAfter", null);
          setValue("dataBefore", null);
        },
      },
      unidadeNome: {
        active: formFilters.unidade !== "all",
        ariaLabel: "Filtrar por unidade",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Unidade</InputLabel>
            <MuiSelect
              label="Unidade"
              value={formFilters.unidade}
              onChange={(event) =>
                applyColumnFilter("unidade", event.target.value)
              }
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => applyColumnFilter("unidade", "all"),
      },
      tipoRefeicaoNome: {
        active: Boolean(formFilters.tipo),
        ariaLabel: "Filtrar por tipo de refeição",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Refeição</InputLabel>
            <MuiSelect
              label="Tipo de Refeição"
              value={formFilters.tipo}
              onChange={(event) => applyColumnFilter("tipo", event.target.value)}
            >
              {tipoRefeicaoOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => applyColumnFilter("tipo", ""),
      },
      status: {
        active: Boolean(formFilters.status),
        ariaLabel: "Filtrar por status",
        content: (
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <MuiSelect
              label="Status"
              value={formFilters.status}
              onChange={(event) =>
                applyColumnFilter("status", event.target.value)
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        ),
        onClear: () => applyColumnFilter("status", ""),
      },
    }),
    [
      control,
      dateAfter,
      dateBefore,
      formFilters.status,
      formFilters.tipo,
      formFilters.unidade,
      applyColumnFilter,
      setValue,
      tipoRefeicaoOptions,
      unitOptions,
    ],
  );

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
        {upcomingError && <Alert severity="error">{upcomingError}</Alert>}

        <Typography fontWeight={500}>Próximos Cardápios</Typography>
        {isLoadingUpcoming ? (
          <Stack alignItems="center" padding={4}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <Stack
            gap={2}
            direction={{ xs: "column", sm: "row" }}
            sx={{ overflowX: "auto", paddingBottom: 1, marginBottom: -1 }}
          >
            {upcomingMenus.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum próximo cardápio encontrado.
              </Typography>
            )}
            {upcomingMenus.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onChanged={refreshMenus}
              />
            ))}
          </Stack>
        )}
      </Stack>

      <Card>
        <Typography>Todos os Cardápios</Typography>
        {tableError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {tableError}
          </Alert>
        )}
        {isLoadingTable && hasLoadedTable && (
          <LinearProgress
            aria-label="Atualizando cardápios"
            sx={{ mt: 2, borderRadius: 1 }}
          />
        )}

        <Table
          columns={menuColumns.map((column) =>
            column.key === "acoes"
              ? {
                  ...column,
                  render: (row: IMenu) => (
                    <Stack direction="row" alignItems="center">
                      <Tooltip title="Visualizar cardápio" arrow>
                        <IconButton
                          aria-label="visualizar cardápio"
                          size="small"
                          onClick={() => {
                            setSelectedMenu(row);
                            setOpenViewMenuModal(true);
                          }}
                          sx={{ height: "fit-content" }}
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
                          sx={{ height: "fit-content" }}
                        >
                          <TrashIcon
                            width={20}
                            color={theme.palette.error.contrastText}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ),
                }
              : column,
          )}
          rows={tableMenus}
          isLoading={isLoadingTable && !hasLoadedTable}
          pageResetKey={tableQueryKey}
          columnFilters={tableColumnFilters}
          getRowKey={(row) => row.id}
          remotePagination={{
            count: tableTotal,
            page: tablePage,
            rowsPerPage: tablePagination.rowsPerPage,
            onPageChange: (page) =>
              setTablePagination((previous) => ({
                ...previous,
                page,
                queryKey: tableQueryKey,
              })),
            onRowsPerPageChange: (rowsPerPage) =>
              setTablePagination({
                page: 0,
                rowsPerPage,
                queryKey: tableQueryKey,
              }),
          }}
        />
      </Card>

      {openViewMenuModal && selectedMenu && (
        <ViewMenuModal
          isOpen={openViewMenuModal}
          onClose={() => setOpenViewMenuModal(false)}
          cardapioId={selectedMenu.id}
          onChanged={refreshMenus}
        />
      )}

      {openDeleteMenuModal && selectedMenu && (
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
      )}
    </React.Fragment>
  );
}
