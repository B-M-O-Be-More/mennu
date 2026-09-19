"use client";

import InfoCard from "@/components/Cards/InfoCard";
import Select from "@/components/FormControl/Select";
import Table from "@/components/Tables/Table";
import { reportsConsumptionHistoryColumns } from "@/data/tableColumns";
import { PaperIcon, RefeicoesIcon } from "@/components/Icons";
import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import React from "react";
import { ConsumptionHistoryTabProps } from "./interface";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import { useUserOptions } from "@/hooks/useUserOptions/hook";
import { useReportFilters } from "@/hooks/useReportFilters";
import { ReportsConsumptionHistoryItem, mapApiRefeicaoToHistoryItem } from "@/Interfaces/Reports/reports";
import { IRefeicoesServidasResumo, mapApiResumoRefeicoesServidas } from "@/Interfaces/Reports/refeicoesServidas";
import ReportDateField from "../../ReportDateField";
import ReportFilterBar, { ReportFilterChip } from "../../ReportFilterBar";
import ReportPeriodPresets from "../../ReportPeriodPresets";
import ReportSection from "../../ReportSection";
import ReportErrorState from "../../ReportErrorState";
import ReportEmptyState from "../../ReportEmptyState";
import { buildDefaultDateRange } from "../../reportDateRange";

interface FilterFields {
  data_inicio: Dayjs;
  data_fim: Dayjs;
  unidade_id: string;
  tipo_refeicao_id: string;
  usuario_id: string;
  manual: string;
}

function buildDefaultFilters(): FilterFields {
  return { ...buildDefaultDateRange(), unidade_id: "all", tipo_refeicao_id: "", usuario_id: "", manual: "" };
}

function buildQueryParams(filters: FilterFields) {
  const params = new URLSearchParams();
  if (filters.data_inicio) params.set("data_inicio", filters.data_inicio.format("YYYY-MM-DD"));
  if (filters.data_fim) params.set("data_fim", filters.data_fim.format("YYYY-MM-DD"));
  if (filters.unidade_id && filters.unidade_id !== "all") params.set("unidade_id", filters.unidade_id);
  if (filters.tipo_refeicao_id) params.set("tipo_refeicao_id", filters.tipo_refeicao_id);
  if (filters.usuario_id) params.set("usuario_id", filters.usuario_id);
  if (filters.manual) params.set("manual", filters.manual);
  return params;
}

/** Um filtro travado num valor só repete esse valor em toda linha — a coluna vira ruído, o chip já conta a história. */
function isPinned(value: string | undefined) {
  return value !== undefined && value !== null && value !== "" && value !== "all";
}

export function ConsumptionHistoryTab({ }: ConsumptionHistoryTabProps) {
  const defaultValues = React.useMemo(buildDefaultFilters, []);
  const filters = useReportFilters(defaultValues, { dateRange: true, storageKey: "report-filters:refeicoes-historico" });
  const applied = filters.applied as FilterFields;

  const { unitOptions } = useUnitFilterOptions();
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(
    applied.unidade_id && applied.unidade_id !== "all" ? applied.unidade_id : undefined,
  );
  const { userOptions } = useUserOptions();

  const [resumo, setResumo] = React.useState<IRefeicoesServidasResumo | null>(null);
  const [rows, setRows] = React.useState<ReportsConsumptionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    if (!applied.data_inicio || !applied.data_fim) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resumoParams = buildQueryParams(applied);
        const resumoResponse = await fetch(`/api/relatorio/refeicoes-servidas/resumo?${resumoParams}`);
        const resumoData = await resumoResponse.json();
        if (!resumoResponse.ok) {
          throw new Error(resumoData.message || "Erro ao carregar totais do período");
        }

        const listParams = buildQueryParams(applied);
        listParams.set("page_size", "200");
        const allResults: ReportsConsumptionHistoryItem[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const params = new URLSearchParams(listParams);
          params.set("page", String(page));
          const response = await fetch(`/api/refeicao?${params}`);
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || "Erro ao carregar histórico de consumo");
          }
          const results = Array.isArray(payload.results) ? payload.results : [];
          allResults.push(...results.map(mapApiRefeicaoToHistoryItem));
          totalPages = payload.metadados?.total_pages ?? 1;
          page += 1;
        } while (page <= totalPages);

        if (cancelled) return;
        setResumo(mapApiResumoRefeicoesServidas(resumoData));
        setRows(allResults);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar histórico de consumo");
        setResumo(null);
        setRows([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(applied), reloadToken]);

  const cards = resumo
    ? [
      { key: "total", label: "Total de Registros", value: resumo.totalPeriodo, icon: <PaperIcon color="#1447E6" />, bgColor: "info.main" },
      { key: "automaticas", label: "Automáticas", value: resumo.totalAutomaticas, icon: <RefeicoesIcon color="#00A63E" />, bgColor: "success.main" },
      { key: "manuais", label: "Manuais", value: resumo.totalManuais, icon: <PaperIcon color="#8200DB" />, bgColor: "purple.main" },
    ]
    : [];

  const periodIsDefault =
    applied.data_inicio?.isSame(defaultValues.data_inicio, "day") &&
    applied.data_fim?.isSame(defaultValues.data_fim, "day");

  const chips: ReportFilterChip[] = [];
  if (applied.data_inicio && applied.data_fim) {
    chips.push({
      key: "periodo",
      label: `Período: ${applied.data_inicio.format("DD/MM")} a ${applied.data_fim.format("DD/MM")}`,
      onRemove: periodIsDefault ? undefined : () => filters.applyValues({ ...applied, ...buildDefaultDateRange() }),
    });
  }
  if (applied.unidade_id && applied.unidade_id !== "all") {
    chips.push({
      key: "unidade_id",
      label: `Unidade: ${unitOptions.find((o) => o.value === applied.unidade_id)?.label ?? applied.unidade_id}`,
      onRemove: () => filters.clearField("unidade_id"),
    });
  }
  if (applied.tipo_refeicao_id) {
    chips.push({
      key: "tipo_refeicao_id",
      label: `Tipo de Refeição: ${tipoRefeicaoOptions.find((o) => o.value === applied.tipo_refeicao_id)?.label ?? applied.tipo_refeicao_id}`,
      onRemove: () => filters.clearField("tipo_refeicao_id"),
    });
  }
  if (applied.usuario_id) {
    chips.push({
      key: "usuario_id",
      label: `Usuário: ${userOptions.find((o) => o.value === applied.usuario_id)?.label ?? applied.usuario_id}`,
      onRemove: () => filters.clearField("usuario_id"),
    });
  }
  if (applied.manual) {
    chips.push({
      key: "manual",
      label: `Origem: ${applied.manual === "true" ? "Manuais" : "Automáticas"}`,
      onRemove: () => filters.clearField("manual"),
    });
  }

  // Filtro travado numa unidade só: toda linha repetiria o mesmo nome, então some com a coluna.
  const hiddenColumnKeys = new Set<string>();
  if (isPinned(applied.unidade_id)) hiddenColumnKeys.add("unidadeNome");
  const columns = reportsConsumptionHistoryColumns.filter((column) => !hiddenColumnKeys.has(String(column.key)));

  return (
    <>
      <ReportFilterBar
        groups={[
          {
            id: "periodo",
            titulo: "Período",
            extra: (
              <ReportPeriodPresets
                dataInicio={filters.draft.data_inicio}
                dataFim={filters.draft.data_fim}
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
                  label="Tipo de Refeição"
                  options={tipoRefeicaoOptions}
                  name="tipo_refeicao_id"
                  control={filters.control}
                  size="small"
                />
                <Select
                  label="Usuário"
                  options={[{ label: "Todos os usuários", value: "" }, ...userOptions]}
                  name="usuario_id"
                  control={filters.control}
                  size="small"
                />
              </>
            ),
          },
          {
            id: "refinamento",
            titulo: "Refinamento",
            children: (
              <Select
                label="Origem"
                options={[
                  { label: "Todas", value: "" },
                  { label: "Automáticas", value: "false" },
                  { label: "Manuais", value: "true" },
                ]}
                name="manual"
                control={filters.control}
                size="small"
              />
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

      <ReportSection id="historico-resumo" title="Resumo do período" plain>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}>
          {isLoading || cards.length === 0
            ? Array.from({ length: 3 }).map((_, index) => <InfoCardSkeleton key={index} />)
            : cards.map((card) => (
              <InfoCard
                key={card.key}
                icon={card.icon}
                bgColor={card.bgColor}
                label={card.label}
                value={card.value}
              />
            ))}
        </Box>
      </ReportSection>

      {!isLoading && rows.length === 0 && !error ? (
        <ReportEmptyState
          actions={[
            ...(filters.isDefault ? [] : [{ label: "Limpar filtros", onClick: filters.clearAll }]),
            { label: "Ampliar para 90 dias", onClick: () => filters.expandPeriod(90) },
            ...(filters.canUndo ? [{ label: "Desfazer último filtro", onClick: filters.undo }] : []),
          ]}
        />
      ) : (
        <ReportSection
          id="historico-registros"
          title="Histórico de Consumo"
          meta={isLoading ? "carregando…" : `${rows.length} registros encontrados`}
        >
          <Table columns={columns} rows={rows} isLoading={isLoading} />
        </ReportSection>
      )}
    </>
  );
}
