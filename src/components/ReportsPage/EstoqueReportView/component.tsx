"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import InfoCard from "@/components/Cards/InfoCard";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import Table from "@/components/Tables/Table";
import Select from "@/components/FormControl/Select";
import TabButton from "@/components/TabButton";
import { EstoqueIcon, PaperIcon } from "@/components/Icons";
import {
  inventarioColumns,
  historicoMovimentacaoColumns,
  consumoEstoqueColumns,
  inventarioOptionalColumns,
  historicoMovimentacaoOptionalColumns,
} from "@/data/tableColumns";
import { mapPreviewCards, IReportResumoCard } from "@/data/reportsCatalog";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import { useReportFilters } from "@/hooks/useReportFilters";
import { useReportColumnVisibility } from "@/hooks/useReportColumnVisibility";
import {
  IInventarioRow,
  IHistoricoMovimentacaoRow,
  IConsumoEstoqueRow,
  mapApiRowInventario,
  mapApiRowHistoricoMovimentacao,
  mapApiRowConsumoEstoque,
} from "@/Interfaces/Reports/estoque";
import ReportDateField from "../ReportDateField";
import ReportPeriodPresets from "../ReportPeriodPresets";
import ReportExportMenu, { ReportExportFormat } from "../ReportExportMenu";
import ReportColumnsMenu from "../ReportColumnsMenu";
import ReportFilterBar, { ReportFilterChip } from "../ReportFilterBar";
import ReportSection from "../ReportSection";
import ReportErrorState from "../ReportErrorState";
import ReportEmptyState from "../ReportEmptyState";
import { buildDefaultDateRange } from "../reportDateRange";

const SUB_TABS = ["Inventário Atual", "Histórico de Movimentação", "Consumo"];
const CARD_PALETTE = [
  { bg: "info.main", color: "#1447E6" },
  { bg: "warning.main", color: "#E17100" },
  { bg: "error.main", color: "#E7000B" },
  { bg: "success.main", color: "#00A63E" },
];

// Vocabulário de `tipo` de movimentação já estabelecido em src/data/tableColumns.tsx (MovementTipo).
const TIPO_MOVIMENTACAO_OPTIONS = [
  { label: "Todos os tipos", value: "" },
  { label: "Entrada", value: "entrada" },
  { label: "Saída", value: "saida" },
  { label: "Perda", value: "perda" },
  { label: "Inventário", value: "inventario" },
  { label: "Transferência (entrada)", value: "transferencia_entrada" },
  { label: "Transferência (saída)", value: "transferencia_saida" },
];

// Definições do menu "Colunas" — construídas uma vez fora do componente porque
// as colunas opcionais são constantes do módulo (não dependem de props/estado).
const INVENTARIO_COLUMN_DEFS = inventarioOptionalColumns.map((column) => ({ key: String(column.key), label: column.label }));
const HISTORICO_COLUMN_DEFS = historicoMovimentacaoOptionalColumns.map((column) => ({ key: String(column.key), label: column.label }));

/** "" e "all" são os sentinelas de "sem filtro" — qualquer outro valor fixa a coluna em toda linha visível. */
function isPinned(value: unknown) {
  return value !== undefined && value !== null && value !== "" && value !== "all";
}

interface HistoricoFilterFields {
  data_inicio: Dayjs;
  data_fim: Dayjs;
  unidade_id: string;
  insumo_id: string;
  tipo: string;
}

function buildDefaultHistoricoFilters(): HistoricoFilterFields {
  return { ...buildDefaultDateRange(), unidade_id: "all", insumo_id: "", tipo: "" };
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? `Erro ao carregar ${url}`);
  return data;
}

export function EstoqueReportView() {
  const [subTab, setSubTab] = React.useState(0);

  const { unitOptions } = useUnitFilterOptions();
  const { insumoOptions } = useInsumoOptions();

  // Panorama (cards de topo)
  const [cards, setCards] = React.useState<IReportResumoCard[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = React.useState(true);
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  const loadPreview = React.useCallback(async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const raw = await fetchJson("/api/relatorio-estoque/preview");
      setCards(mapPreviewCards(raw));
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Erro ao carregar o panorama do estoque");
      setCards([]);
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  // Inventário
  const [inventario, setInventario] = React.useState<IInventarioRow[]>([]);
  const [isLoadingInventario, setIsLoadingInventario] = React.useState(true);
  const [inventarioError, setInventarioError] = React.useState<string | null>(null);

  const loadInventario = React.useCallback(async () => {
    setIsLoadingInventario(true);
    setInventarioError(null);
    try {
      const raw = await fetchJson("/api/relatorio-estoque/inventario");
      setInventario((Array.isArray(raw) ? raw : []).map(mapApiRowInventario));
    } catch (err) {
      setInventarioError(err instanceof Error ? err.message : "Erro ao carregar inventário");
    } finally {
      setIsLoadingInventario(false);
    }
  }, []);

  React.useEffect(() => {
    if (subTab === 0) void loadInventario();
  }, [subTab, loadInventario]);

  const inventarioColumnsVisibility = useReportColumnVisibility("report-columns:estoque-inventario", INVENTARIO_COLUMN_DEFS);

  const inventarioTableColumns = React.useMemo(
    () => [
      ...inventarioColumns,
      ...inventarioOptionalColumns.filter((column) => inventarioColumnsVisibility.isVisible(String(column.key))),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inventarioColumnsVisibility.visibleKeys],
  );

  const inventarioExportFormats: ReportExportFormat[] = [
    { formato: "csv", label: "Baixar CSV", href: "/api/relatorio-estoque/inventario/exportar?formato=csv" },
    { formato: "pdf", label: "Baixar PDF", href: "/api/relatorio-estoque/inventario/exportar?formato=pdf" },
  ];

  // Histórico de movimentação — paginado, com filtros próprios (período, unidade, insumo, tipo)
  const [historico, setHistorico] = React.useState<IHistoricoMovimentacaoRow[]>([]);
  const [historicoTotal, setHistoricoTotal] = React.useState(0);
  const [historicoPage, setHistoricoPage] = React.useState(1);
  const [historicoRowsPerPage, setHistoricoRowsPerPage] = React.useState(5);
  const [isLoadingHistorico, setIsLoadingHistorico] = React.useState(true);
  const [historicoError, setHistoricoError] = React.useState<string | null>(null);

  const defaultHistoricoFilters = React.useMemo(buildDefaultHistoricoFilters, []);
  const historicoFilters = useReportFilters(defaultHistoricoFilters, {
    dateRange: true,
    storageKey: "report-filters:estoque-historico",
  });
  const appliedHistorico = historicoFilters.applied as HistoricoFilterFields;

  const historicoParams = React.useCallback(() => {
    const params = new URLSearchParams();
    if (appliedHistorico.data_inicio) params.set("data_inicio", appliedHistorico.data_inicio.format("YYYY-MM-DD"));
    if (appliedHistorico.data_fim) params.set("data_fim", appliedHistorico.data_fim.format("YYYY-MM-DD"));
    if (appliedHistorico.unidade_id && appliedHistorico.unidade_id !== "all") params.set("unidade_id", appliedHistorico.unidade_id);
    if (appliedHistorico.insumo_id) params.set("insumo_id", appliedHistorico.insumo_id);
    if (appliedHistorico.tipo) params.set("tipo", appliedHistorico.tipo);
    return params;
  }, [
    appliedHistorico.data_inicio,
    appliedHistorico.data_fim,
    appliedHistorico.unidade_id,
    appliedHistorico.insumo_id,
    appliedHistorico.tipo,
  ]);

  const loadHistorico = React.useCallback(async () => {
    setIsLoadingHistorico(true);
    setHistoricoError(null);
    try {
      const params = historicoParams();
      params.set("page", String(historicoPage));
      params.set("page_size", String(historicoRowsPerPage));
      const raw = await fetchJson(`/api/relatorio-estoque/historico?${params}`);
      const results = Array.isArray(raw.results) ? raw.results : [];
      setHistorico(results.map(mapApiRowHistoricoMovimentacao));
      setHistoricoTotal(raw.metadados?.total_results ?? results.length);
    } catch (err) {
      setHistoricoError(err instanceof Error ? err.message : "Erro ao carregar histórico de movimentação");
    } finally {
      setIsLoadingHistorico(false);
    }
  }, [historicoParams, historicoPage, historicoRowsPerPage]);

  React.useEffect(() => {
    if (subTab === 1) void loadHistorico();
  }, [subTab, loadHistorico]);

  // Recorte novo pode ser bem menor que o total — volta pra página 1 pra não
  // apontar pra uma página que não existe mais no resultado filtrado.
  React.useEffect(() => {
    setHistoricoPage(1);
  }, [historicoParams]);

  const historicoPeriodIsDefault =
    appliedHistorico.data_inicio?.isSame(defaultHistoricoFilters.data_inicio, "day") &&
    appliedHistorico.data_fim?.isSame(defaultHistoricoFilters.data_fim, "day");

  const historicoChips: ReportFilterChip[] = [];
  if (appliedHistorico.data_inicio && appliedHistorico.data_fim) {
    historicoChips.push({
      key: "periodo",
      label: `Período: ${appliedHistorico.data_inicio.format("DD/MM")} a ${appliedHistorico.data_fim.format("DD/MM")}`,
      onRemove: historicoPeriodIsDefault
        ? undefined
        : () => historicoFilters.applyValues({ ...appliedHistorico, ...buildDefaultDateRange() }),
    });
  }
  if (appliedHistorico.unidade_id && appliedHistorico.unidade_id !== "all") {
    historicoChips.push({
      key: "unidade",
      label: `Unidade: ${unitOptions.find((o) => o.value === appliedHistorico.unidade_id)?.label ?? appliedHistorico.unidade_id}`,
      onRemove: () => historicoFilters.clearField("unidade_id"),
    });
  }
  if (appliedHistorico.insumo_id) {
    historicoChips.push({
      key: "insumo",
      label: `Insumo: ${insumoOptions.find((o) => o.value === appliedHistorico.insumo_id)?.label ?? appliedHistorico.insumo_id}`,
      onRemove: () => historicoFilters.clearField("insumo_id"),
    });
  }
  if (appliedHistorico.tipo) {
    historicoChips.push({
      key: "tipo",
      label: `Tipo: ${TIPO_MOVIMENTACAO_OPTIONS.find((o) => o.value === appliedHistorico.tipo)?.label ?? appliedHistorico.tipo}`,
      onRemove: () => historicoFilters.clearField("tipo"),
    });
  }

  // Coluna redundante quando o filtro já fixou aquele valor em toda linha visível.
  const hiddenHistoricoColumnKeys = React.useMemo(() => {
    const hidden = new Set<string>();
    if (isPinned(appliedHistorico.unidade_id)) hidden.add("unidade");
    if (isPinned(appliedHistorico.insumo_id)) hidden.add("insumo");
    if (isPinned(appliedHistorico.tipo)) hidden.add("tipo");
    return hidden;
  }, [appliedHistorico.unidade_id, appliedHistorico.insumo_id, appliedHistorico.tipo]);

  const historicoColumnsVisibility = useReportColumnVisibility("report-columns:estoque-historico", HISTORICO_COLUMN_DEFS);

  const historicoTableColumns = React.useMemo(() => {
    const base = historicoMovimentacaoColumns.filter((column) => !hiddenHistoricoColumnKeys.has(String(column.key)));
    const extras = historicoMovimentacaoOptionalColumns.filter((column) => historicoColumnsVisibility.isVisible(String(column.key)));
    return [...base, ...extras];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenHistoricoColumnKeys, historicoColumnsVisibility.visibleKeys]);

  const historicoExportFormats: ReportExportFormat[] = React.useMemo(() => {
    const csvParams = historicoParams();
    csvParams.set("formato", "csv");
    const pdfParams = historicoParams();
    pdfParams.set("formato", "pdf");
    return [
      { formato: "csv", label: "Baixar CSV", href: `/api/relatorio-estoque/historico/exportar?${csvParams}` },
      { formato: "pdf", label: "Baixar PDF", href: `/api/relatorio-estoque/historico/exportar?${pdfParams}` },
    ];
  }, [historicoParams]);

  // Consumo — período aplicado explicitamente
  const defaultConsumoFilters = React.useMemo(buildDefaultDateRange, []);
  const consumoFilters = useReportFilters(defaultConsumoFilters, {
    dateRange: true,
    storageKey: "report-filters:estoque-consumo",
  });
  const appliedConsumo = consumoFilters.applied as { data_inicio: Dayjs; data_fim: Dayjs };

  const [consumo, setConsumo] = React.useState<IConsumoEstoqueRow[]>([]);
  const [isLoadingConsumo, setIsLoadingConsumo] = React.useState(true);
  const [consumoError, setConsumoError] = React.useState<string | null>(null);
  const [consumoReloadToken, setConsumoReloadToken] = React.useState(0);

  const consumoParams = React.useCallback(() => {
    const params = new URLSearchParams();
    if (appliedConsumo.data_inicio) params.set("data_inicio", appliedConsumo.data_inicio.format("YYYY-MM-DD"));
    if (appliedConsumo.data_fim) params.set("data_fim", appliedConsumo.data_fim.format("YYYY-MM-DD"));
    return params;
  }, [appliedConsumo.data_inicio, appliedConsumo.data_fim]);

  React.useEffect(() => {
    if (subTab !== 2) return;
    if (!appliedConsumo.data_inicio || !appliedConsumo.data_fim) return;

    let cancelled = false;
    (async () => {
      setIsLoadingConsumo(true);
      setConsumoError(null);
      try {
        const raw = await fetchJson(`/api/relatorio-estoque/consumo?${consumoParams()}`);
        if (cancelled) return;
        setConsumo((Array.isArray(raw) ? raw : []).map(mapApiRowConsumoEstoque));
      } catch (err) {
        if (cancelled) return;
        setConsumoError(err instanceof Error ? err.message : "Erro ao carregar consumo de estoque");
      } finally {
        if (!cancelled) setIsLoadingConsumo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTab, appliedConsumo.data_inicio, appliedConsumo.data_fim, consumoReloadToken]);

  const consumoExportFormats: ReportExportFormat[] = React.useMemo(() => {
    const csvParams = consumoParams();
    csvParams.set("formato", "csv");
    const pdfParams = consumoParams();
    pdfParams.set("formato", "pdf");
    return [
      { formato: "csv", label: "Baixar CSV", href: `/api/relatorio-estoque/consumo/exportar?${csvParams}` },
      { formato: "pdf", label: "Baixar PDF", href: `/api/relatorio-estoque/consumo/exportar?${pdfParams}` },
    ];
  }, [consumoParams]);

  return (
    <>
      <ReportSection id="estoque-panorama" title="Panorama do estoque" description="Números atuais, independentes da aba escolhida" plain>
        {previewError ? (
          <ReportErrorState message={previewError} onRetry={loadPreview} isRetrying={isLoadingPreview} />
        ) : (
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
            {isLoadingPreview
              ? Array.from({ length: 4 }).map((_, index) => <InfoCardSkeleton key={index} />)
              : cards.map((card, index) => {
                  const palette = CARD_PALETTE[index % CARD_PALETTE.length];
                  return (
                    <InfoCard
                      key={card.label}
                      icon={<EstoqueIcon color={palette.color} />}
                      bgColor={palette.bg}
                      label={card.label}
                      value={card.value}
                    />
                  );
                })}
          </Box>
        )}
      </ReportSection>

      <Stack direction="row" gap={2} flexWrap="wrap" role="group" aria-label="Recorte do relatório de estoque">
        {SUB_TABS.map((label, index) => (
          <TabButton key={label} label={label} tabIndex={index} activeTab={subTab} onChange={setSubTab} />
        ))}
      </Stack>

      {subTab === 0 && (
        <ReportSection
          id="estoque-inventario"
          title="Inventário Atual"
          meta={isLoadingInventario ? "carregando…" : `${inventario.length} insumos`}
          action={
            <Stack direction="row" gap={1} alignItems="center">
              <ReportExportMenu formats={inventarioExportFormats} disabled={inventario.length === 0} size="small" />
              <ReportColumnsMenu visibility={inventarioColumnsVisibility} />
            </Stack>
          }
        >
          {inventarioError ? (
            <ReportErrorState message={inventarioError} onRetry={loadInventario} isRetrying={isLoadingInventario} />
          ) : !isLoadingInventario && inventario.length === 0 ? (
            <ReportEmptyState
              title="Nenhum insumo no inventário"
              description="Nada cadastrado ou nada visível pra sua unidade no momento."
              icon={<EstoqueIcon width={24} height={24} />}
              actions={[{ label: "Recarregar", onClick: loadInventario }]}
            />
          ) : (
            <Table columns={inventarioTableColumns} rows={inventario} isLoading={isLoadingInventario} initialRowsPerPage={10} />
          )}
        </ReportSection>
      )}

      {subTab === 1 && (
        <>
          <ReportFilterBar
            groups={[
              {
                id: "periodo",
                titulo: "Período",
                extra: (
                  <ReportPeriodPresets
                    dataInicio={historicoFilters.draft.data_inicio}
                    dataFim={historicoFilters.draft.data_fim}
                    onSelect={(dataInicio, dataFim) =>
                      historicoFilters.applyValues({ ...appliedHistorico, data_inicio: dataInicio, data_fim: dataFim })
                    }
                  />
                ),
                children: (
                  <>
                    <ReportDateField label="Data Início" name="data_inicio" control={historicoFilters.control} />
                    <ReportDateField label="Data Fim" name="data_fim" control={historicoFilters.control} />
                  </>
                ),
              },
              {
                id: "escopo",
                titulo: "Escopo",
                children: (
                  <>
                    <Select label="Unidade" options={unitOptions} name="unidade_id" control={historicoFilters.control} size="small" />
                    <Select
                      label="Insumo"
                      options={[{ label: "Todos os insumos", value: "" }, ...insumoOptions]}
                      name="insumo_id"
                      control={historicoFilters.control}
                      size="small"
                    />
                  </>
                ),
              },
              {
                id: "refinamento",
                titulo: "Refinamento",
                children: (
                  <Select label="Tipo" options={TIPO_MOVIMENTACAO_OPTIONS} name="tipo" control={historicoFilters.control} size="small" />
                ),
              },
            ]}
            chips={historicoChips}
            dirty={historicoFilters.dirty}
            canClear={!historicoFilters.isDefault}
            canUndo={historicoFilters.canUndo}
            dateIssue={historicoFilters.dateIssue}
            isLoading={isLoadingHistorico}
            onApply={historicoFilters.apply}
            onDiscard={historicoFilters.discard}
            onClear={historicoFilters.clearAll}
            onUndo={historicoFilters.undo}
          />

          <ReportSection
            id="estoque-historico"
            title="Histórico de Movimentação"
            meta={isLoadingHistorico ? "carregando…" : `${historicoTotal} movimentações`}
            action={
              <Stack direction="row" gap={1} alignItems="center">
                <ReportExportMenu formats={historicoExportFormats} disabled={historicoTotal === 0} size="small" />
                <ReportColumnsMenu visibility={historicoColumnsVisibility} />
              </Stack>
            }
          >
            {historicoError ? (
              <ReportErrorState message={historicoError} onRetry={loadHistorico} isRetrying={isLoadingHistorico} />
            ) : (
              <Table
                columns={historicoTableColumns}
                rows={historico}
                isLoading={isLoadingHistorico}
                remotePagination={{
                  count: historicoTotal,
                  page: historicoPage - 1,
                  rowsPerPage: historicoRowsPerPage,
                  onPageChange: (nextPage) => setHistoricoPage(nextPage + 1),
                  onRowsPerPageChange: (nextRowsPerPage) => {
                    setHistoricoRowsPerPage(nextRowsPerPage);
                    setHistoricoPage(1);
                  },
                }}
              />
            )}
          </ReportSection>
        </>
      )}

      {subTab === 2 && (
        <>
          <ReportFilterBar
            groups={[
              {
                id: "periodo",
                titulo: "Período",
                extra: (
                  <ReportPeriodPresets
                    dataInicio={consumoFilters.draft.data_inicio}
                    dataFim={consumoFilters.draft.data_fim}
                    onSelect={(dataInicio, dataFim) =>
                      consumoFilters.applyValues({ ...appliedConsumo, data_inicio: dataInicio, data_fim: dataFim })
                    }
                  />
                ),
                children: (
                  <>
                    <ReportDateField label="Data Início" name="data_inicio" control={consumoFilters.control} />
                    <ReportDateField label="Data Fim" name="data_fim" control={consumoFilters.control} />
                  </>
                ),
              },
            ]}
            chips={[
              {
                key: "periodo",
                label: `Período: ${appliedConsumo.data_inicio?.format("DD/MM")} a ${appliedConsumo.data_fim?.format("DD/MM")}`,
                onRemove: consumoFilters.isDefault ? undefined : consumoFilters.clearAll,
              },
            ]}
            dirty={consumoFilters.dirty}
            canClear={!consumoFilters.isDefault}
            canUndo={consumoFilters.canUndo}
            dateIssue={consumoFilters.dateIssue}
            isLoading={isLoadingConsumo}
            onApply={consumoFilters.apply}
            onDiscard={consumoFilters.discard}
            onClear={consumoFilters.clearAll}
            onUndo={consumoFilters.undo}
          />

          <ReportSection
            id="estoque-consumo"
            title="Consumo por insumo"
            meta={isLoadingConsumo ? "carregando…" : `${consumo.length} insumos`}
            action={<ReportExportMenu formats={consumoExportFormats} disabled={consumo.length === 0} size="small" />}
          >
            {consumoError ? (
              <ReportErrorState
                message={consumoError}
                onRetry={() => setConsumoReloadToken((token) => token + 1)}
                isRetrying={isLoadingConsumo}
              />
            ) : !isLoadingConsumo && consumo.length === 0 ? (
              <ReportEmptyState
                icon={<PaperIcon width={24} height={24} />}
                actions={[
                  ...(consumoFilters.isDefault ? [] : [{ label: "Limpar filtros", onClick: consumoFilters.clearAll }]),
                  { label: "Ampliar para 90 dias", onClick: () => consumoFilters.expandPeriod(90) },
                  ...(consumoFilters.canUndo ? [{ label: "Desfazer último filtro", onClick: consumoFilters.undo }] : []),
                ]}
              />
            ) : (
              <Table columns={consumoEstoqueColumns} rows={consumo} isLoading={isLoadingConsumo} initialRowsPerPage={10} />
            )}
          </ReportSection>
        </>
      )}
    </>
  );
}
