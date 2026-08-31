"use client";

import React from "react";
import { Alert, Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import Table from "@/components/Tables/Table";
import Can from "@/components/Can";
import {
  ClockIcon,
  FilterIcon,
  PaperIcon,
  PlusIcon,
  SearchIcon,
  TwistedArrowIcon,
  XIcon,
} from "@/components/Icons";
import { SelectOption } from "@/components/FormControl/Select/interface";
import { stockAuditColumns } from "@/data/tableColumns";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useForm } from "react-hook-form";
import {
  IStockAudit,
  IStockAuditResponse,
} from "@/Interfaces/StockAudit/stockAudit";
import { isDraft, summarizeAudits, toStatusKey } from "@/utils/stockAuditUtils";
import NewStockAuditModal from "@/components/Modals/NewStockAuditModal";
import { StockAuditPanelProps } from "./interface";

const PAGE_SIZE = 200;

/** Dimensões dos cards de resumo, conforme o design. */
const CARD_HEIGHT = 86;
const ICON_BOX_SIZE = 48;
const ICON_BOX_SIZE_PX = `${ICON_BOX_SIZE}px`;

const statusOptions: SelectOption[] = [
  { label: "Status", value: "all" },
  { label: "Rascunho", value: "rascunho" },
  { label: "Enviado", value: "enviada" },
  { label: "Com Divergência", value: "com_divergencia" },
  { label: "Normalizada", value: "normalizada" },
];

const periodOptions: SelectOption[] = [
  { label: "Período", value: "all" },
  { label: "Hoje", value: "hoje" },
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Este mês", value: "mes" },
];

/** Traduz a opção de período nas datas que a API espera (`YYYY-MM-DD`). */
function resolvePeriod(period: string) {
  const today = dayjs();
  const format = (date: dayjs.Dayjs) => date.format("YYYY-MM-DD");

  switch (period) {
    case "hoje":
      return { data_inicio: format(today), data_fim: format(today) };
    case "7d":
      return {
        data_inicio: format(today.subtract(6, "day")),
        data_fim: format(today),
      };
    case "30d":
      return {
        data_inicio: format(today.subtract(29, "day")),
        data_fim: format(today),
      };
    case "mes":
      return {
        data_inicio: format(today.startOf("month")),
        data_fim: format(today),
      };
    default:
      return {};
  }
}

type FilterForm = {
  auditSearch: string;
  unidade: string;
  status: string;
  auditor: string;
  periodo: string;
};

export default function StockAuditPanel({
  refreshToken = 0,
  onNewAudit,
  onOpenAudit,
}: StockAuditPanelProps) {
  const { unitOptions } = useUnitFilterOptions();

  const [audits, setAudits] = React.useState<IStockAudit[]>([]);
  const [totalResults, setTotalResults] = React.useState<number>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isNewAuditOpen, setIsNewAuditOpen] = React.useState(false);

  // Os auditores só aparecem nos próprios registros — acumulamos os já vistos
  // para o filtro não encolher depois de filtrar por um deles.
  const [auditorsSeen, setAuditorsSeen] = React.useState<
    Record<string, string>
  >({});

  const { register, control, watch } = useForm<FilterForm>({
    defaultValues: {
      auditSearch: "",
      unidade: "all",
      status: "all",
      auditor: "all",
      periodo: "all",
    },
  });

  const filters = watch();
  const debouncedSearch = useDebounce(filters.auditSearch, 500);

  const loadAudits = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page_size: String(PAGE_SIZE) });

      if (filters.unidade && filters.unidade !== "all") {
        params.set("unidade_id", filters.unidade);
      }
      if (filters.auditor && filters.auditor !== "all") {
        params.set("auditor_id", filters.auditor);
      }

      const period = resolvePeriod(filters.periodo);
      if (period.data_inicio) params.set("data_inicio", period.data_inicio);
      if (period.data_fim) params.set("data_fim", period.data_fim);

      const response = await fetch(`/api/auditoria-estoque?${params}`);

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar auditorias" }));
        throw new Error(errData.message ?? "Erro ao carregar auditorias");
      }

      const payload: IStockAuditResponse = await response.json();
      const results = payload.results ?? [];

      setAudits(results);
      setTotalResults(payload.metadados?.total_results);
      setAuditorsSeen((prev) => {
        const next = { ...prev };
        results.forEach((audit) => {
          if (audit.auditor_id) {
            next[String(audit.auditor_id)] = audit.auditor_nome ?? "Auditor";
          }
        });
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar auditorias");
      setAudits([]);
      setTotalResults(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [filters.unidade, filters.auditor, filters.periodo]);

  React.useEffect(() => {
    loadAudits();
  }, [loadAudits, refreshToken]);

  const auditorOptions: SelectOption[] = React.useMemo(
    () => [
      { label: "Auditor", value: "all" },
      ...Object.entries(auditorsSeen).map(([value, label]) => ({
        label,
        value,
      })),
    ],
    [auditorsSeen],
  );

  // Busca textual e status são filtrados no client: a API não expõe parâmetro
  // de busca e o schema declara `status` como string livre, sem enum — assim
  // que os valores forem confirmados, ambos podem subir para a query.
  const visibleAudits = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return audits.filter((audit) => {
      const matchesTerm =
        !term ||
        [audit.unidade_nome, audit.auditor_nome, audit.status]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "com_divergencia"
          ? toStatusKey(audit.status) === "com_divergencia" ||
            audit.total_divergentes > 0
          : toStatusKey(audit.status) === filters.status);

      return matchesTerm && matchesStatus;
    });
  }, [audits, debouncedSearch, filters.status]);

  const summary = React.useMemo(
    () => summarizeAudits(visibleAudits, visibleAudits.length === audits.length ? totalResults : undefined),
    [visibleAudits, audits.length, totalResults],
  );

  const summaryCards = [
    {
      title: "Auditorias no período",
      value: summary.total,
      icon: <TwistedArrowIcon color="#155DFC" width={28} height={28} />,
      bgColor: "info.main",
    },
    {
      title: "Em andamento",
      value: summary.emAndamento,
      icon: <ClockIcon color="#E17100" width={28} height={28} />,
      bgColor: "warning.main",
    },
    {
      title: "Com divergência",
      value: summary.comDivergencia,
      icon: <XIcon color="#E7000B" width={28} height={28} />,
      bgColor: "error.main",
    },
    {
      title: "Normalizadas",
      value: summary.normalizadas,
      icon: <PaperIcon color="#E17100" width={28} height={28} />,
      bgColor: "warning.main",
    },
  ];

  const columns = stockAuditColumns.map((col) =>
    col.key === "acoes"
      ? {
          ...col,
          render: (row: IStockAudit) => {
            const label = isDraft(row) ? "Continuar" : "VER";

            if (!onOpenAudit) {
              return (
                <Tooltip title="Em breve">
                  <span>
                    <Button variant="contained" size="small" disabled>
                      {label}
                    </Button>
                  </span>
                </Tooltip>
              );
            }

            return (
              <Button
                variant="contained"
                size="small"
                onClick={() => onOpenAudit(row)}
              >
                {label}
              </Button>
            );
          },
        }
      : col,
  );

  return (
    <Card>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
      >
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            flexDirection="row"
            alignItems="center"
            height={CARD_HEIGHT}
            spacing={0}
            gap={1.5}
            padding={2}
          >
            <IconBox
              icon={card.icon}
              bgColor={card.bgColor}
              padding={0}
              maxWidth={ICON_BOX_SIZE_PX}
              maxHeight={ICON_BOX_SIZE_PX}
              sx={{
                width: ICON_BOX_SIZE,
                height: ICON_BOX_SIZE,
                minWidth: ICON_BOX_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <Box>
              <Typography color="text.secondary" variant="body2">
                {card.title}
              </Typography>
              <Typography variant="h5" color="text.primary">
                {card.value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Stack gap={2} direction="row">
        <Input
          placeholder="Buscar por..."
          icon={<SearchIcon />}
          register={register("auditSearch")}
        />

        <Select
          options={unitOptions}
          name="unidade"
          control={control}
          formControlSx={{ maxWidth: "250px" }}
        />

        <Select
          options={statusOptions}
          name="status"
          control={control}
          formControlSx={{ maxWidth: "200px" }}
        />

        <Select
          options={auditorOptions}
          name="auditor"
          control={control}
          formControlSx={{ maxWidth: "200px" }}
        />

        <Select
          options={periodOptions}
          name="periodo"
          control={control}
          formControlSx={{ maxWidth: "200px" }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ fontWeight: "400", minWidth: "120px" }}
          onClick={() => loadAudits()}
        >
          Filtrar
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h6" fontWeight={400}>
            Auditoria do Estoque
          </Typography>

          <Can permissions="auditoriaestoque.create.item">
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() =>
                onNewAudit ? onNewAudit() : setIsNewAuditOpen(true)
              }
              sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
            >
              Nova Auditoria
            </Button>
          </Can>
        </Stack>

        <Table
          columns={columns}
          rows={visibleAudits}
          initialRowsPerPage={5}
          isLoading={isLoading}
        />

        <NewStockAuditModal
          open={isNewAuditOpen}
          onClose={() => setIsNewAuditOpen(false)}
          onCreated={loadAudits}
        />
      </Card>
    </Card>
  );
}
