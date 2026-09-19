"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import InfoCard from "@/components/Cards/InfoCard";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import Select from "@/components/FormControl/Select";
import { PaperIcon, RefeicoesIcon, EstoqueIcon, TerminalIcon } from "@/components/Icons";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useReportFilters } from "@/hooks/useReportFilters";
import { IRelatorioGerencial, mapApiRelatorioGerencial } from "@/Interfaces/Reports/gerencial";
import ReportDateField from "../ReportDateField";
import ReportFilterBar, { ReportFilterChip } from "../ReportFilterBar";
import ReportPeriodPresets from "../ReportPeriodPresets";
import ReportExportMenu from "../ReportExportMenu";
import ReportSection from "../ReportSection";
import ReportErrorState from "../ReportErrorState";
import ReportEmptyState from "../ReportEmptyState";
import { buildDefaultDateRange } from "../reportDateRange";

interface FilterFields {
  data_inicio: Dayjs;
  data_fim: Dayjs;
  unidade_id: string;
}

function buildDefaultFilters(): FilterFields {
  return { ...buildDefaultDateRange(), unidade_id: "all" };
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? `Erro ao carregar ${url}`);
  return data;
}

export function GerencialReportView() {
  const { unitOptions } = useUnitFilterOptions();
  const defaultValues = React.useMemo(buildDefaultFilters, []);
  const filters = useReportFilters(defaultValues, { dateRange: true, storageKey: "report-filters:gerencial" });
  const applied = filters.applied as FilterFields;

  const [dados, setDados] = React.useState<IRelatorioGerencial | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadToken, setReloadToken] = React.useState(0);

  const buildParams = React.useCallback((source: FilterFields) => {
    const params = new URLSearchParams();
    if (source.data_inicio) params.set("data_inicio", source.data_inicio.format("YYYY-MM-DD"));
    if (source.data_fim) params.set("data_fim", source.data_fim.format("YYYY-MM-DD"));
    if (source.unidade_id && source.unidade_id !== "all") params.set("unidade_id", source.unidade_id);
    return params;
  }, []);

  React.useEffect(() => {
    if (!applied.data_inicio || !applied.data_fim) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await fetchJson(`/api/relatorio/gerencial/?${buildParams(applied)}`);
        if (cancelled) return;
        setDados(mapApiRelatorioGerencial(raw));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar relatório gerencial");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(applied), reloadToken]);

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
      key: "unidade",
      label: `Unidade: ${unitOptions.find((o) => o.value === applied.unidade_id)?.label ?? applied.unidade_id}`,
      onRemove: () => filters.clearField("unidade_id"),
    });
  }

  const skeletons = (quantidade: number) =>
    Array.from({ length: quantidade }).map((_, index) => <InfoCardSkeleton key={index} />);

  return (
    <>
      <Stack direction="row" justifyContent="flex-end">
        {/* Exportar/exportar não tem CSV nesse endpoint — só PDF — então o menu já nasce como 1 botão de 1 clique */}
        <ReportExportMenu
          formats={[
            { formato: "pdf", label: "Baixar PDF", href: `/api/relatorio/gerencial/exportar?${buildParams(applied)}` },
          ]}
          disabled={isLoading || Boolean(error)}
        />
      </Stack>

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
              <Select label="Unidade" options={unitOptions} name="unidade_id" control={filters.control} size="small" />
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

      {!isLoading && !dados && !error ? (
        <ReportEmptyState
          title="Sem indicadores para o período"
          description="O recorte selecionado não retornou KPIs. Amplie o período ou troque a unidade."
          actions={[
            ...(filters.isDefault ? [] : [{ label: "Limpar filtros", onClick: filters.clearAll }]),
            { label: "Ampliar para 90 dias", onClick: () => filters.expandPeriod(90) },
            ...(filters.canUndo ? [{ label: "Desfazer último filtro", onClick: filters.undo }] : []),
          ]}
        />
      ) : (
        <Stack gap={3}>
          <ReportSection id="gerencial-operacao" title="Operação" description="Volume servido e aderência ao planejado" plain>
            <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
              {isLoading || !dados
                ? skeletons(6)
                : [
                    <InfoCard key="total-refeicoes" icon={<RefeicoesIcon color="#00A63E" />} bgColor="success.main" label="Total de Refeições" value={dados.operacao.totalRefeicoes} />,
                    <InfoCard key="media-diaria" icon={<RefeicoesIcon color="#1447E6" />} bgColor="info.main" label="Média Diária" value={dados.operacao.mediaDiaria} />,
                    <InfoCard key="taxa-presenca" icon={<PaperIcon color="#8200DB" />} bgColor="purple.main" label="Taxa de Presença (%)" value={dados.operacao.taxaPresenca} />,
                    <InfoCard key="aderencia-cardapio" icon={<PaperIcon color="#E17100" />} bgColor="warning.main" label="Aderência de Cardápio (%)" value={dados.operacao.aderenciaCardapio} />,
                    <InfoCard key="refeicoes-manuais" icon={<PaperIcon color="#E7000B" />} bgColor="error.main" label="Refeições Manuais" value={dados.operacao.refeicoesManuais} />,
                    <InfoCard key="percentual-manuais" icon={<PaperIcon color="#1447E6" />} bgColor="info.main" label="% Manuais" value={dados.operacao.percentualManuais} />,
                  ]}
            </Box>
          </ReportSection>

          <ReportSection id="gerencial-estoque" title="Estoque" description="Cobertura de insumos e perdas no período" plain>
            <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
              {isLoading || !dados
                ? skeletons(4)
                : [
                    <InfoCard key="itens-criticos" icon={<EstoqueIcon color="#E7000B" />} bgColor="error.main" label="Itens Críticos" value={dados.estoque.itensCriticos} />,
                    <InfoCard key="itens-baixo-estoque" icon={<EstoqueIcon color="#E17100" />} bgColor="warning.main" label="Itens em Baixo Estoque" value={dados.estoque.itensBaixoEstoque} />,
                    <InfoCard key="taxa-desperdicio" icon={<EstoqueIcon color="#8200DB" />} bgColor="purple.main" label="Taxa de Desperdício (%)" value={dados.estoque.taxaDesperdicio} />,
                    <InfoCard key="total-insumos" icon={<EstoqueIcon color="#00A63E" />} bgColor="success.main" label="Total de Insumos" value={dados.estoque.totalInsumos} />,
                  ]}
            </Box>
          </ReportSection>

          <ReportSection id="gerencial-tecnologia" title="Tecnologia" description="Disponibilidade dos terminais e acessos" plain>
            <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}>
              {isLoading || !dados
                ? skeletons(4)
                : [
                    <InfoCard key="total-terminais" icon={<TerminalIcon color="#1447E6" />} bgColor="info.main" label="Total de Terminais" value={dados.tecnologia.totalTerminais} />,
                    <InfoCard key="disponibilidade" icon={<TerminalIcon color="#00A63E" />} bgColor="success.main" label="Disponibilidade (%)" value={dados.tecnologia.disponibilidadeTerminais} />,
                    <InfoCard key="taxa-falha-acesso" icon={<TerminalIcon color="#E7000B" />} bgColor="error.main" label="Taxa de Falha de Acesso (%)" value={dados.tecnologia.taxaFalhaAcesso} />,
                    <InfoCard key="total-acessos" icon={<TerminalIcon color="#8200DB" />} bgColor="purple.main" label="Total de Acessos" value={dados.tecnologia.totalAcessos} />,
                  ]}
            </Box>
          </ReportSection>
        </Stack>
      )}
    </>
  );
}
