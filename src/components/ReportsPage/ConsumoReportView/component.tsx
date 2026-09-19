"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import InfoCard from "@/components/Cards/InfoCard";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import Table, { IColumn } from "@/components/Tables/Table";
import Select from "@/components/FormControl/Select";
import TabButton from "@/components/TabButton";
import ReportDateField from "../ReportDateField";
import RankingChart from "@/components/Charts/RankingChart";
import { PaperIcon, TrashIcon } from "@/components/Icons";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import { useReportFilters } from "@/hooks/useReportFilters";
import { consumoColumns, desperdicioColumns } from "@/data/tableColumns";
import { mapPreviewCards, mapPreviewChart } from "@/data/reportsCatalog";
import { mapApiRowConsumo } from "@/Interfaces/Reports/consumo";
import { mapApiRowDesperdicio, mapApiResumoDesperdicioCards } from "@/Interfaces/Reports/desperdicio";
import ReportPeriodPresets from "../ReportPeriodPresets";
import ReportExportMenu, { ReportExportFormat } from "../ReportExportMenu";
import ReportFilterBar, { ReportFilterChip } from "../ReportFilterBar";
import ReportSection from "../ReportSection";
import ReportErrorState from "../ReportErrorState";
import ReportEmptyState from "../ReportEmptyState";
import { buildDefaultDateRange } from "../reportDateRange";

const SUB_TABS = ["Consumo", "Desperdício"];
const CARD_PALETTE = [
  { bg: "info.main", color: "#1447E6" },
  { bg: "success.main", color: "#00A63E" },
  { bg: "purple.main", color: "#8200DB" },
  { bg: "warning.main", color: "#E17100" },
];

/** Fallback só usado quando o card não veio de `/preview` (sem `cor` do backend). */
function cardPalette(card: { cor?: string }, index: number) {
  if (card.cor) return { bg: `${card.cor}1a`, color: card.cor };
  return CARD_PALETTE[index % CARD_PALETTE.length];
}

/** "" é o sentinela de "sem filtro" pro insumo — qualquer outro valor é um filtro fixado. */
function isPinned(value: unknown) {
  return value !== undefined && value !== null && value !== "" && value !== "all";
}

interface FilterFields {
  data_inicio: Dayjs;
  data_fim: Dayjs;
  unidade_id: string;
  insumo_id: string;
}

function buildDefaultFilters(): FilterFields {
  return { ...buildDefaultDateRange(), unidade_id: "all", insumo_id: "" };
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? `Erro ao carregar ${url}`);
  return data;
}

export function ConsumoReportView() {
  const [subTab, setSubTab] = React.useState(0);
  const isConsumo = subTab === 0;

  const { unitOptions } = useUnitFilterOptions();
  const { insumoOptions } = useInsumoOptions();
  const defaultValues = React.useMemo(buildDefaultFilters, []);
  const filters = useReportFilters(defaultValues, { dateRange: true, storageKey: "report-filters:consumo" });
  const applied = filters.applied as FilterFields;
  const draft = filters.draft as FilterFields;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = React.useState<any[]>([]);
  const [cards, setCards] = React.useState<{ label: string; value: string | number; cor?: string }[]>([]);
  const [chartData, setChartData] = React.useState<{ label: string; value: number }[]>([]);
  const [chartTitulo, setChartTitulo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);

  const buildParams = React.useCallback((source: Partial<FilterFields>) => {
    const params = new URLSearchParams();
    if (source.data_inicio) params.set("data_inicio", source.data_inicio.format("YYYY-MM-DD"));
    if (source.data_fim) params.set("data_fim", source.data_fim.format("YYYY-MM-DD"));
    if (source.unidade_id && source.unidade_id !== "all") params.set("unidade_id", source.unidade_id);
    if (source.insumo_id) params.set("insumo_id", source.insumo_id);
    return params;
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = buildParams(applied);
        const base = isConsumo ? "/api/relatorio/consumo" : "/api/relatorio/consumo/desperdicio";
        const listarUrl = isConsumo ? `${base}/?${params}` : `${base}?${params}`;
        const requests: Promise<unknown>[] = [fetchJson(listarUrl)];
        requests.push(fetchJson(isConsumo ? `${base}/preview?${params}` : `${base}/resumo?${params}`));

        const [listarData, secondData] = await Promise.all(requests);
        if (cancelled) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapRow: (raw: any) => any = isConsumo ? mapApiRowConsumo : mapApiRowDesperdicio;
        setRows((Array.isArray(listarData) ? listarData : []).map(mapRow));

        if (isConsumo) {
          setCards(mapPreviewCards(secondData));
          const chart = mapPreviewChart(secondData);
          setChartTitulo(chart.titulo);
          setChartData(chart.pontos.map((p) => ({ label: p.label, value: p.valor })));
        } else {
          setCards(mapApiResumoDesperdicioCards(secondData));
          setChartData([]);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar relatório de consumo");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConsumo, JSON.stringify(applied), reloadToken]);

  const exportFormats: ReportExportFormat[] = React.useMemo(() => {
    const base = isConsumo ? "/api/relatorio/consumo" : "/api/relatorio/consumo/desperdicio";
    const csvParams = buildParams(applied);
    csvParams.set("formato", "csv");
    const pdfParams = buildParams(applied);
    pdfParams.set("formato", "pdf");
    return [
      { formato: "csv", label: "Baixar CSV", href: `${base}/exportar?${csvParams}` },
      { formato: "pdf", label: "Baixar PDF", href: `${base}/exportar?${pdfParams}` },
    ];
  }, [applied, isConsumo, buildParams]);

  const periodIsDefault =
    applied.data_inicio?.isSame(defaultValues.data_inicio, "day") &&
    applied.data_fim?.isSame(defaultValues.data_fim, "day");

  const chips: ReportFilterChip[] = [];
  if (applied.data_inicio && applied.data_fim) {
    chips.push({
      key: "periodo",
      label: `Período: ${applied.data_inicio.format("DD/MM")} a ${applied.data_fim.format("DD/MM")}`,
      onRemove: periodIsDefault
        ? undefined
        : () => filters.applyValues({ ...applied, ...buildDefaultDateRange() }),
    });
  }
  if (applied.unidade_id && applied.unidade_id !== "all") {
    chips.push({
      key: "unidade",
      label: `Unidade: ${unitOptions.find((o) => o.value === applied.unidade_id)?.label ?? applied.unidade_id}`,
      onRemove: () => filters.clearField("unidade_id"),
    });
  }
  if (applied.insumo_id) {
    chips.push({
      key: "insumo",
      label: `Insumo: ${insumoOptions.find((o) => o.value === applied.insumo_id)?.label ?? applied.insumo_id}`,
      onRemove: () => filters.clearField("insumo_id"),
    });
  }

  const emptyActions = [
    ...(filters.isDefault ? [] : [{ label: "Limpar filtros", onClick: filters.clearAll }]),
    { label: "Ampliar para 90 dias", onClick: () => filters.expandPeriod(90) },
    ...(filters.canUndo ? [{ label: "Desfazer último filtro", onClick: filters.undo }] : []),
  ];

  const tituloAba = isConsumo ? "Consumo de Insumos" : "Desperdício de Insumos";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colunasAbaBase = (isConsumo ? consumoColumns : desperdicioColumns) as IColumn<any>[];
  // Coluna "Insumo" repetiria o mesmo nome em toda linha quando o filtro já fixou um insumo — o chip já avisa qual é.
  const colunasAba = isPinned(applied.insumo_id)
    ? colunasAbaBase.filter((column) => String(column.key) !== "nome")
    : colunasAbaBase;

  return (
    <>
      <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="space-between" alignItems="center">
        <Stack direction="row" gap={1} role="group" aria-label="Recorte do relatório de insumos">
          {SUB_TABS.map((label, index) => (
            <TabButton key={label} label={label} tabIndex={index} activeTab={subTab} onChange={setSubTab} />
          ))}
        </Stack>
        <ReportExportMenu formats={exportFormats} />
      </Stack>

      <ReportFilterBar
        groups={[
          {
            id: "periodo",
            titulo: "Período",
            extra: (
              <ReportPeriodPresets
                dataInicio={draft.data_inicio}
                dataFim={draft.data_fim}
                onSelect={(dataInicio, dataFim) => filters.applyValues({ ...applied, data_inicio: dataInicio, data_fim: dataFim })}
              />
            ),
            children: (
              <>
                <ReportDateField label="Data Início" name="data_inicio" control={filters.control} />
                <ReportDateField label="Data Fim" name="data_fim" control={filters.control} />
              </>
            ),
          },
          {
            id: "escopo",
            titulo: "Escopo",
            children: (
              <>
                <Select label="Unidade" options={unitOptions} name="unidade_id" control={filters.control} size="small" />
                <Select
                  label="Insumo"
                  options={[{ label: "Todos os insumos", value: "" }, ...insumoOptions]}
                  name="insumo_id"
                  control={filters.control}
                  size="small"
                />
              </>
            ),
          },
        ]}
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

      {error && (
        <ReportErrorState
          message={error}
          onRetry={() => setReloadToken((token) => token + 1)}
          isRetrying={isLoading}
          secondaryAction={filters.isDefault ? undefined : { label: "Limpar filtros", onClick: filters.clearAll }}
        />
      )}

      {(isLoading || cards.length > 0) && (
        <ReportSection id="resumo-insumos" title={`Resumo — ${tituloAba}`} plain>
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
            {isLoading && cards.length === 0
              ? Array.from({ length: 4 }).map((_, index) => <InfoCardSkeleton key={index} />)
              : cards.map((card, index) => {
                  const palette = cardPalette(card, index);
                  return (
                    <InfoCard
                      key={card.label}
                      icon={isConsumo ? <PaperIcon color={palette.color} /> : <TrashIcon color={palette.color} />}
                      bgColor={palette.bg}
                      label={card.label}
                      value={card.value}
                    />
                  );
                })}
          </Box>
        </ReportSection>
      )}

      {isConsumo && chartData.length > 0 && !isLoading && (
        <ReportSection id="ranking-insumos" title="Ranking de insumos" plain>
          <RankingChart title={chartTitulo || "Top Insumos por Consumo"} data={chartData} unit="" />
        </ReportSection>
      )}

      {!isLoading && rows.length === 0 && !error ? (
        <ReportEmptyState actions={emptyActions} />
      ) : (
        <ReportSection id="registros-insumos" title={tituloAba} meta={isLoading ? "carregando…" : `${rows.length} registros`}>
          <Table columns={colunasAba} rows={rows} isLoading={isLoading} initialRowsPerPage={5} />
        </ReportSection>
      )}
    </>
  );
}
