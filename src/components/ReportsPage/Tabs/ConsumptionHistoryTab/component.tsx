import Card from "@/components/Cards/Card";
import InfoCard from "@/components/Cards/InfoCard";
import ReportsFilterForm from "@/components/Forms/ReportsFilterForm";
import { ReportsFilterFormValues } from "@/components/Forms/ReportsFilterForm";
import Table from "@/components/Tables/Table";
import { reportsConsumptionHistoryColumns } from "@/data/tableColumns";
import { PaperIcon, RefeicoesIcon } from "@/components/Icons";
import { Alert, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { ConsumptionHistoryTabProps } from "./interface";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";
import { ReportsConsumptionHistoryItem, mapApiRefeicaoToHistoryItem } from "@/Interfaces/Reports/reports";
import { IRefeicoesServidasResumo, mapApiResumoRefeicoesServidas } from "@/Interfaces/Reports/refeicoesServidas";

function buildQueryParams(filters: ReportsFilterFormValues) {
  const params = new URLSearchParams();
  if (filters.dataInicio) params.set("data_inicio", filters.dataInicio.format("YYYY-MM-DD"));
  if (filters.dataFim) params.set("data_fim", filters.dataFim.format("YYYY-MM-DD"));
  if (filters.unidadeId && filters.unidadeId !== "all") params.set("unidade_id", filters.unidadeId);
  if (filters.tipoRefeicaoId) params.set("tipo_refeicao_id", filters.tipoRefeicaoId);
  if (filters.usuarioId) params.set("usuario_id", filters.usuarioId);
  return params;
}

export function ConsumptionHistoryTab({ }: ConsumptionHistoryTabProps) {
  const [filters, setFilters] = React.useState<ReportsFilterFormValues | null>(null);
  const [resumo, setResumo] = React.useState<IRefeicoesServidasResumo | null>(null);
  const [rows, setRows] = React.useState<ReportsConsumptionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!filters || !filters.dataInicio || !filters.dataFim) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resumoParams = buildQueryParams(filters);
        const resumoResponse = await fetch(`/api/relatorio/refeicoes-servidas/resumo?${resumoParams}`);
        const resumoData = await resumoResponse.json();
        if (!resumoResponse.ok) {
          throw new Error(resumoData.message || "Erro ao carregar totais do período");
        }

        const listParams = buildQueryParams(filters);
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
  }, [filters]);

  const cards = resumo
    ? [
      { key: "total", label: "Total de Registros", value: resumo.totalPeriodo, icon: <PaperIcon color="#1447E6" />, bgColor: "info.main" },
      { key: "automaticas", label: "Automáticas", value: resumo.totalAutomaticas, icon: <RefeicoesIcon color="#00A63E" />, bgColor: "success.main" },
      { key: "manuais", label: "Manuais", value: resumo.totalManuais, icon: <PaperIcon color="#8200DB" />, bgColor: "purple.main" },
    ]
    : [];

  return (
    <>
      <ReportsFilterForm onChange={setFilters} />

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
            <InfoCardSkeleton key={index} />
          ))
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

      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Typography>Histórico de Consumo</Typography>
          {!isLoading && (
            <Typography variant="body2" color={"text.secondary"}>
              {rows.length} registros encontrados
            </Typography>
          )}
        </Stack>

        <Table
          columns={reportsConsumptionHistoryColumns}
          rows={rows}
          isLoading={isLoading}
        />
      </Card>
    </>
  );
}
