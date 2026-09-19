"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import InfoCard from "@/components/Cards/InfoCard";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import Table from "@/components/Tables/Table";
import Select from "@/components/FormControl/Select";
import TabButton from "@/components/TabButton";
import { PaperIcon, StatsIcon, TwistedArrowIcon } from "@/components/Icons";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import { useTerminalOptions } from "@/hooks/useTerminalOptions/hook";
import { useUserOptions } from "@/hooks/useUserOptions/hook";
import { useReportFilters } from "@/hooks/useReportFilters";
import { useReportColumnVisibility } from "@/hooks/useReportColumnVisibility";
import { FilterFieldConfig, IReportResumoCard, mapPreviewCards, mapPreviewChart } from "@/data/reportsCatalog";
import ReportChart from "../ReportChart";
import ReportDateField from "../ReportDateField";
import ReportFilterBar, { ReportFilterChip, ReportFilterGroup } from "../ReportFilterBar";
import ReportPeriodPresets from "../ReportPeriodPresets";
import ReportExportMenu, { ReportExportFormat } from "../ReportExportMenu";
import ReportColumnsMenu from "../ReportColumnsMenu";
import ReportSection from "../ReportSection";
import ReportErrorState from "../ReportErrorState";
import ReportEmptyState from "../ReportEmptyState";
import { buildDefaultDateRange } from "../reportDateRange";
import { ReportViewerProps } from "./interface";

type Option = { label: string; value: string };

interface OptionsBag {
  unitOptions: Option[];
  tipoRefeicaoOptions: Option[];
  insumoOptions: Option[];
  terminalOptions: Option[];
  userOptions: Option[];
}

function labelFor(options: Option[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Rótulo visível de cada campo — o filtro não pode depender do placeholder. */
function fieldLabel(field: FilterFieldConfig) {
  if (field.type === "unidade") return "Unidade";
  if (field.type === "tipoRefeicao") return "Tipo de Refeição";
  if (field.type === "insumo") return "Insumo";
  if (field.type === "terminal") return "Terminal";
  return field.type === "usuario" || field.type === "select" ? field.label : "";
}

/** "" (select) e "all" (unidade) são os sentinelas de "sem filtro" — qualquer outra coisa é um valor fixado. */
function isPinned(value: unknown) {
  return value !== undefined && value !== null && value !== "" && value !== "all";
}

interface ChipDeps {
  fields: FilterFieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applied: Record<string, any>;
  bag: OptionsBag;
  onClearField: (field: string) => void;
  onResetPeriod: () => void;
  periodIsDefault: boolean;
}

function buildChips({ fields, applied, bag, onClearField, onResetPeriod, periodIsDefault }: ChipDeps) {
  const chips: ReportFilterChip[] = [];

  fields.forEach((field) => {
    if (field.type === "dateRange") {
      const dataInicio = applied.data_inicio as Dayjs | undefined;
      const dataFim = applied.data_fim as Dayjs | undefined;
      if (dataInicio && dataFim) {
        chips.push({
          key: "periodo",
          label: `Período: ${dataInicio.format("DD/MM")} a ${dataFim.format("DD/MM")}`,
          onRemove: periodIsDefault ? undefined : onResetPeriod,
        });
      }
      return;
    }
    if (field.type === "unidade") {
      if (applied.unidade_id && applied.unidade_id !== "all") {
        chips.push({
          key: "unidade_id",
          label: `Unidade: ${labelFor(bag.unitOptions, applied.unidade_id)}`,
          onRemove: () => onClearField("unidade_id"),
        });
      }
      return;
    }
    if (field.type === "tipoRefeicao") {
      if (applied.tipo_refeicao_id) {
        chips.push({
          key: "tipo_refeicao_id",
          label: `Tipo de Refeição: ${labelFor(bag.tipoRefeicaoOptions, applied.tipo_refeicao_id)}`,
          onRemove: () => onClearField("tipo_refeicao_id"),
        });
      }
      return;
    }
    if (field.type === "insumo") {
      if (applied.insumo_id) {
        chips.push({
          key: "insumo_id",
          label: `Insumo: ${labelFor(bag.insumoOptions, applied.insumo_id)}`,
          onRemove: () => onClearField("insumo_id"),
        });
      }
      return;
    }
    if (field.type === "terminal") {
      if (applied.terminal_id) {
        chips.push({
          key: "terminal_id",
          label: `Terminal: ${labelFor(bag.terminalOptions, applied.terminal_id)}`,
          onRemove: () => onClearField("terminal_id"),
        });
      }
      return;
    }
    if (field.type === "usuario") {
      if (applied[field.field]) {
        chips.push({
          key: field.field,
          label: `${field.label}: ${labelFor(bag.userOptions, applied[field.field])}`,
          onRemove: () => onClearField(field.field),
        });
      }
      return;
    }
    if (field.type === "select" && applied[field.field]) {
      chips.push({
        key: field.field,
        label: `${field.label}: ${labelFor(field.options, applied[field.field])}`,
        onRemove: () => onClearField(field.field),
      });
    }
  });

  return chips;
}

/** Fallback só usado quando o card não veio de `/preview` (sem `cor` do backend). */
const CARD_PALETTE: { bg: string; color: string }[] = [
  { bg: "info.main", color: "#1447E6" },
  { bg: "success.main", color: "#00A63E" },
  { bg: "purple.main", color: "#8200DB" },
  { bg: "warning.main", color: "#E17100" },
  { bg: "error.main", color: "#E7000B" },
];

function cardPalette(card: IReportResumoCard, index: number) {
  if (card.cor) return { bg: `${card.cor}1a`, color: card.cor };
  return CARD_PALETTE[index % CARD_PALETTE.length];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDefaultValues(fields: FilterFieldConfig[]): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: Record<string, any> = {};
  fields.forEach((field) => {
    if (field.type === "dateRange") {
      Object.assign(values, buildDefaultDateRange());
    } else if (field.type === "unidade") values.unidade_id = "all";
    else if (field.type === "tipoRefeicao") values.tipo_refeicao_id = "";
    else if (field.type === "insumo") values.insumo_id = "";
    else if (field.type === "terminal") values.terminal_id = "";
    else if (field.type === "usuario") values[field.field] = "";
    else if (field.type === "select") values[field.field] = "";
  });
  return values;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQueryParams(filters: Record<string, any>, fields: FilterFieldConfig[]) {
  const params = new URLSearchParams();

  fields.forEach((field) => {
    if (field.type === "dateRange") {
      const dataInicio = filters.data_inicio as Dayjs | undefined;
      const dataFim = filters.data_fim as Dayjs | undefined;
      if (dataInicio) params.set("data_inicio", dataInicio.format("YYYY-MM-DD"));
      if (dataFim) params.set("data_fim", dataFim.format("YYYY-MM-DD"));
      return;
    }
    if (field.type === "unidade") {
      if (filters.unidade_id && filters.unidade_id !== "all") params.set("unidade_id", filters.unidade_id);
      return;
    }
    if (field.type === "tipoRefeicao") {
      if (filters.tipo_refeicao_id) params.set("tipo_refeicao_id", filters.tipo_refeicao_id);
      return;
    }
    if (field.type === "insumo") {
      if (filters.insumo_id) params.set("insumo_id", filters.insumo_id);
      return;
    }
    if (field.type === "terminal") {
      if (filters.terminal_id) params.set("terminal_id", filters.terminal_id);
      return;
    }
    if (field.type === "usuario" || field.type === "select") {
      const value = filters[field.field];
      if (value) params.set(field.field, value);
    }
  });

  return params;
}

/** Aba extra só aceita período+unidade — nunca os filtros mais específicos (status, insumo etc). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildExtraViewParams(applied: Record<string, any>) {
  const params = new URLSearchParams();
  const dataInicio = applied.data_inicio as Dayjs | undefined;
  const dataFim = applied.data_fim as Dayjs | undefined;
  if (dataInicio) params.set("data_inicio", dataInicio.format("YYYY-MM-DD"));
  if (dataFim) params.set("data_fim", dataFim.format("YYYY-MM-DD"));
  if (applied.unidade_id && applied.unidade_id !== "all") params.set("unidade_id", applied.unidade_id);
  return params;
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? `Erro ao carregar ${url}`);
  }
  return data;
}

interface FilterFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  field: FilterFieldConfig;
  bag: OptionsBag;
}

function FilterField({ control, field, bag }: FilterFieldProps) {
  const { unitOptions, tipoRefeicaoOptions, insumoOptions, terminalOptions, userOptions } = bag;

  if (field.type === "dateRange") {
    return (
      <>
        <ReportDateField label="Data Início" name="data_inicio" control={control} />
        <ReportDateField label="Data Fim" name="data_fim" control={control} />
      </>
    );
  }

  if (field.type === "unidade") {
    return <Select label={fieldLabel(field)} options={unitOptions} name="unidade_id" control={control} size="small" />;
  }

  if (field.type === "tipoRefeicao") {
    return (
      <Select
        label={fieldLabel(field)}
        options={tipoRefeicaoOptions}
        name="tipo_refeicao_id"
        control={control}
        size="small"
      />
    );
  }

  if (field.type === "insumo") {
    return (
      <Select
        label={fieldLabel(field)}
        options={[{ label: "Todos os insumos", value: "" }, ...insumoOptions]}
        name="insumo_id"
        control={control}
        size="small"
      />
    );
  }

  if (field.type === "terminal") {
    return (
      <Select
        label={fieldLabel(field)}
        options={[{ label: "Todos os terminais", value: "" }, ...terminalOptions]}
        name="terminal_id"
        control={control}
        size="small"
      />
    );
  }

  if (field.type === "usuario") {
    return (
      <Select
        label={field.label}
        options={[{ label: `Todos (${field.label})`, value: "" }, ...userOptions]}
        name={field.field}
        control={control}
        size="small"
      />
    );
  }

  return <Select label={field.label} options={field.options} name={field.field} control={control} size="small" />;
}

const ESCOPO_TYPES = ["unidade", "tipoRefeicao", "insumo", "terminal", "usuario"];

export function ReportViewer({ entry }: ReportViewerProps) {
  const hasChart = Boolean(entry.endpoints.preview);
  const hasDateRange = entry.filterFields.some((field) => field.type === "dateRange");
  const tabs = React.useMemo(
    () => [
      { key: "overview" as const, label: "Visão Geral", icon: <TwistedArrowIcon height={24} /> },
      ...(hasChart ? [{ key: "chart" as const, label: "Gráficos", icon: <StatsIcon height={24} /> }] : []),
      ...(entry.extraView ? [{ key: "extra" as const, label: entry.extraView.label, icon: <PaperIcon height={24} /> }] : []),
    ],
    [hasChart, entry.extraView],
  );

  const defaultValues = React.useMemo(() => buildDefaultValues(entry.filterFields), [entry.filterFields]);

  const [activeTab, setActiveTab] = React.useState(0);
  const filters = useReportFilters(defaultValues, { dateRange: hasDateRange, storageKey: `report-filters:${entry.slug}` });
  const { applied, draft, control } = filters;

  const { unitOptions } = useUnitFilterOptions();
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(
    draft.unidade_id && draft.unidade_id !== "all" ? draft.unidade_id : undefined,
  );
  const { insumoOptions } = useInsumoOptions();
  const { terminalOptions } = useTerminalOptions();
  const { userOptions } = useUserOptions();
  const optionsBag: OptionsBag = { unitOptions, tipoRefeicaoOptions, insumoOptions, terminalOptions, userOptions };

  const columnDefs = React.useMemo(
    () => (entry.optionalColumns ?? []).map((column) => ({ key: String(column.key), label: column.label })),
    [entry.optionalColumns],
  );
  const columnVisibility = useReportColumnVisibility(`report-columns:${entry.slug}`, columnDefs);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = React.useState<any[]>([]);
  const [cards, setCards] = React.useState<IReportResumoCard[]>([]);
  const [chartData, setChartData] = React.useState<{ label: string; value: number }[]>([]);
  const [chartTitulo, setChartTitulo] = React.useState("");
  const [chartTipo, setChartTipo] = React.useState("barra");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  /** Bump manual do "Tentar novamente" — refaz a busca sem mexer no recorte. */
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = buildQueryParams(applied, entry.filterFields);
        const requests: Promise<unknown>[] = [fetchJson(`${entry.endpoints.listar}?${params}`)];

        if (entry.endpoints.preview) requests.push(fetchJson(`${entry.endpoints.preview}?${params}`));
        else if (entry.endpoints.resumo) requests.push(fetchJson(`${entry.endpoints.resumo}?${params}`));

        const [listarData, secondData] = await Promise.all(requests);
        if (cancelled) return;

        setRows((Array.isArray(listarData) ? listarData : []).map(entry.mapRow));

        if (entry.endpoints.preview) {
          setCards(mapPreviewCards(secondData));
          const chart = mapPreviewChart(secondData);
          setChartTitulo(chart.titulo);
          setChartTipo(chart.tipo);
          setChartData(chart.pontos.map((p) => ({ label: p.label, value: p.valor })));
        } else if (entry.mapResumoCardsFallback) {
          setCards(entry.mapResumoCardsFallback(secondData));
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : `Erro ao carregar ${entry.titulo}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.slug, JSON.stringify(applied), reloadToken]);

  // Aba extra: só busca quando aberta — não pesa nas outras 6 telas que não a usam.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [extraRows, setExtraRows] = React.useState<any[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = React.useState(true);
  const [extraError, setExtraError] = React.useState<string | null>(null);
  const activeKey = tabs[activeTab]?.key;

  React.useEffect(() => {
    if (activeKey !== "extra" || !entry.extraView) return;
    const extraView = entry.extraView;
    let cancelled = false;

    (async () => {
      setIsLoadingExtra(true);
      setExtraError(null);
      try {
        const params = buildExtraViewParams(applied);
        const raw = await fetchJson(`${extraView.endpoint}?${params}`);
        if (cancelled) return;
        setExtraRows((Array.isArray(raw) ? raw : []).map(extraView.mapRow));
      } catch (err) {
        if (cancelled) return;
        setExtraError(err instanceof Error ? err.message : `Erro ao carregar ${extraView.label}`);
      } finally {
        if (!cancelled) setIsLoadingExtra(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, entry.extraView, applied.data_inicio, applied.data_fim, applied.unidade_id, reloadToken]);

  const exportFormats: ReportExportFormat[] = React.useMemo(() => {
    const base = buildQueryParams(applied, entry.filterFields);
    const csvParams = new URLSearchParams(base);
    csvParams.set("formato", "csv");
    const pdfParams = new URLSearchParams(base);
    pdfParams.set("formato", "pdf");
    return [
      { formato: "csv", label: "Baixar CSV", href: `${entry.endpoints.exportar}?${csvParams}` },
      { formato: "pdf", label: "Baixar PDF", href: `${entry.endpoints.exportar}?${pdfParams}` },
    ];
  }, [applied, entry.filterFields, entry.endpoints.exportar]);

  const resetPeriod = React.useCallback(
    () => filters.applyValues({ ...applied, ...buildDefaultDateRange() }),
    [applied, filters],
  );

  const periodIsDefault =
    !hasDateRange ||
    ((applied.data_inicio as Dayjs | undefined)?.isSame(defaultValues.data_inicio, "day") === true &&
      (applied.data_fim as Dayjs | undefined)?.isSame(defaultValues.data_fim, "day") === true);

  const chips = buildChips({
    fields: entry.filterFields,
    applied,
    bag: optionsBag,
    onClearField: filters.clearField,
    onResetPeriod: resetPeriod,
    periodIsDefault,
  });

  const groups: ReportFilterGroup[] = React.useMemo(() => {
    const periodo = entry.filterFields.filter((field) => field.type === "dateRange");
    const escopo = entry.filterFields.filter((field) => ESCOPO_TYPES.includes(field.type));
    const refinamento = entry.filterFields.filter((field) => field.type === "select");

    const build = (id: string, titulo: string, fields: FilterFieldConfig[], extra?: React.ReactNode) =>
      fields.length > 0
        ? [
            {
              id,
              titulo,
              extra,
              children: fields.map((field, index) => (
                <FilterField key={`${id}-${index}`} control={control} field={field} bag={optionsBag} />
              )),
            },
          ]
        : [];

    const presets = periodo.length > 0 && (
      <ReportPeriodPresets
        dataInicio={draft.data_inicio}
        dataFim={draft.data_fim}
        onSelect={(dataInicio, dataFim) => filters.applyValues({ ...applied, data_inicio: dataInicio, data_fim: dataFim })}
      />
    );

    return [
      ...build("periodo", "Período", periodo, presets || undefined),
      ...build("escopo", "Escopo", escopo),
      ...build("refinamento", "Refinamento", refinamento),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.filterFields, control, unitOptions, tipoRefeicaoOptions, insumoOptions, terminalOptions, userOptions, draft.data_inicio, draft.data_fim, applied]);

  const emptyActions = [
    ...(filters.isDefault ? [] : [{ label: "Limpar filtros", onClick: filters.clearAll }]),
    ...(hasDateRange ? [{ label: "Ampliar para 90 dias", onClick: () => filters.expandPeriod(90) }] : []),
    ...(filters.canUndo ? [{ label: "Desfazer último filtro", onClick: filters.undo }] : []),
  ];

  // Coluna redundante quando o filtro já fixou aquele valor em toda linha visível, mais
  // as extras que o usuário ligou no menu "Colunas".
  const visibleColumns = React.useMemo(() => {
    const hiddenByContext = new Set<string>();
    if (entry.contextColumns) {
      Object.entries(entry.contextColumns).forEach(([field, columnKey]) => {
        if (isPinned(applied[field])) hiddenByContext.add(columnKey);
      });
    }
    const base = entry.columns.filter((column) => !hiddenByContext.has(String(column.key)));
    const extras = (entry.optionalColumns ?? []).filter((column) => columnVisibility.isVisible(String(column.key)));
    return [...base, ...extras];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.columns, entry.optionalColumns, entry.contextColumns, applied, columnVisibility.visibleKeys]);

  return (
    <>
      <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={2} role="group" aria-label="Modo de visualização do relatório">
          {tabs.map((tab, index) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              icon={tab.icon}
              tabIndex={index}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          ))}
        </Stack>

        <ReportExportMenu formats={exportFormats} />
      </Stack>

      <ReportFilterBar
        groups={groups}
        chips={chips}
        dirty={filters.dirty}
        canClear={!filters.isDefault}
        canUndo={filters.canUndo}
        dateIssue={filters.dateIssue}
        isLoading={isLoading}
        onApply={filters.apply}
        onDiscard={filters.discard}
        onClear={filters.clearAll}
        onUndo={filters.undo}
      />

      {error && activeKey !== "extra" && (
        <ReportErrorState
          message={error}
          onRetry={() => setReloadToken((token) => token + 1)}
          isRetrying={isLoading}
          secondaryAction={filters.isDefault ? undefined : { label: "Limpar filtros", onClick: filters.clearAll }}
        />
      )}

      {activeKey === "overview" ? (
        <>
          {(isLoading || cards.length > 0) && (
            <ReportSection id="resumo" title="Resumo do período" plain>
              <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
                {isLoading && cards.length === 0
                  ? Array.from({ length: 4 }).map((_, index) => <InfoCardSkeleton key={index} />)
                  : cards.map((card, index) => {
                      const palette = cardPalette(card, index);
                      return (
                        <InfoCard
                          key={card.label}
                          icon={<PaperIcon color={palette.color} />}
                          bgColor={palette.bg}
                          label={card.label}
                          value={card.value}
                        />
                      );
                    })}
              </Box>
            </ReportSection>
          )}

          {!isLoading && rows.length === 0 && !error ? (
            <ReportEmptyState actions={emptyActions} />
          ) : (
            <ReportSection
              id="registros"
              title={entry.titulo}
              meta={isLoading ? "carregando…" : `${rows.length} registros`}
              action={<ReportColumnsMenu visibility={columnVisibility} />}
            >
              <Table columns={visibleColumns} rows={rows} isLoading={isLoading} initialRowsPerPage={5} />
            </ReportSection>
          )}
        </>
      ) : activeKey === "chart" ? (
        chartData.length === 0 && !isLoading ? (
          <ReportEmptyState
            title="Sem dados para o gráfico"
            description="O recorte atual não gerou série nenhuma. Amplie o período ou remova um filtro."
            actions={emptyActions}
          />
        ) : (
          <ReportSection id="grafico" title="Gráficos" plain>
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Carregando gráfico…
              </Typography>
            ) : (
              <ReportChart tipo={chartTipo} titulo={chartTitulo || entry.titulo} pontos={chartData} />
            )}
          </ReportSection>
        )
      ) : entry.extraView ? (
        <>
          {extraError && (
            <ReportErrorState message={extraError} onRetry={() => setReloadToken((token) => token + 1)} isRetrying={isLoadingExtra} />
          )}
          {!isLoadingExtra && extraRows.length === 0 && !extraError ? (
            <ReportEmptyState actions={emptyActions} />
          ) : (
            <ReportSection
              id="extra"
              title={entry.extraView.label}
              meta={isLoadingExtra ? "carregando…" : `${extraRows.length} registros`}
            >
              <Table columns={entry.extraView.columns} rows={extraRows} isLoading={isLoadingExtra} initialRowsPerPage={5} />
            </ReportSection>
          )}
        </>
      ) : null}
    </>
  );
}
