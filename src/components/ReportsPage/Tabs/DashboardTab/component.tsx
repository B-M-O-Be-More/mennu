import KPICard from "@/components/Cards/KPICard";
import { RelatoriosIcon, PaperIcon } from "@/components/Icons";
import { Box, Stack } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import Vertical7DaysChart from "@/components/Charts/Vertical7DaysChart";
import RankingChart from "@/components/Charts/RankingChart";
import React from "react";
import dayjs from "dayjs";
import KPICardSkeleton from "@/components/Skeletons/Cards/KPICardSkeleton";
import ReportSection from "../../ReportSection";
import ReportErrorState from "../../ReportErrorState";
import Select from "@/components/FormControl/Select";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { DashboardTabProps, KPICardData } from "./interface";
import {
  IRefeicoesServidasResumo,
  IRefeicoesServidasRow,
  mapApiResumoRefeicoesServidas,
  mapApiRowRefeicoesServidas,
  mapApiPreviewRefeicoesServidas,
} from "@/Interfaces/Reports/refeicoesServidas";

const DATA_FIM = dayjs();
const DATA_INICIO = DATA_FIM.subtract(6, "day");
const PERIODO_LABEL = `${DATA_INICIO.format("DD/MM")} a ${DATA_FIM.format("DD/MM")}`;

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? `Erro ao carregar ${url}`);
  }
  return data;
}

function topN(rows: IRefeicoesServidasRow[], labelField: "tipoRefeicao" | "unidade", n: number) {
  return rows
    .map((row) => ({ label: row[labelField], value: row.totalServidas }))
    .filter((item) => item.label)
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

export function DashboardTab({ }: DashboardTabProps) {
  const { unitOptions } = useUnitFilterOptions();
  const [unidadeId, setUnidadeId] = React.useState("all");
  const [resumo, setResumo] = React.useState<IRefeicoesServidasResumo | null>(null);
  const [chartData, setChartData] = React.useState<{ label: string; value: number }[]>([]);
  const [rankingTipos, setRankingTipos] = React.useState<{ label: string; value: number }[]>([]);
  const [rankingUnidades, setRankingUnidades] = React.useState<{ label: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  /** Um único ponto de carga, pra que o "Tentar novamente" refaça tudo. */
  const load = React.useCallback(async () => {
    const params = new URLSearchParams({
      data_inicio: DATA_INICIO.format("YYYY-MM-DD"),
      data_fim: DATA_FIM.format("YYYY-MM-DD"),
    });

    if (unidadeId !== "all") {
      params.set("unidade_id", unidadeId);
    }

    setIsLoading(true);
    setError(null);

    try {
      const [resumoData, previewData, porTipo, porUnidade] = await Promise.all([
        fetchJson(`/api/relatorio/refeicoes-servidas/resumo?${params}`),
        fetchJson(`/api/relatorio/refeicoes-servidas/preview?${params}`),
        fetchJson(`/api/relatorio/refeicoes-servidas?${params}&agrupamento=tipo_refeicao`),
        fetchJson(`/api/relatorio/refeicoes-servidas?${params}&agrupamento=unidade`),
      ]);

      setResumo(mapApiResumoRefeicoesServidas(resumoData));
      setChartData(
        mapApiPreviewRefeicoesServidas(previewData).grafico.map((p) => ({ label: p.label, value: p.valor })),
      );
      setRankingTipos(topN((porTipo as unknown[]).map(mapApiRowRefeicoesServidas), "tipoRefeicao", 5));
      setRankingUnidades(topN((porUnidade as unknown[]).map(mapApiRowRefeicoesServidas), "unidade", 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dashboard de relatórios");
    } finally {
      setIsLoading(false);
    }
  }, [unidadeId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const kpis: KPICardData[] | null = resumo
    ? [
      {
        id: "total-refeicoes",
        label: "Total Refeições",
        icon: <RelatoriosIcon color="#00A63E" />,
        bgColor: "success.main",
        value: resumo.totalPeriodo,
      },
      {
        id: "media-diaria",
        label: "Média Diária",
        bgColor: "info.main",
        icon: <TrendingUp sx={{ color: "info.contrastText" }} />,
        value: resumo.mediaDiaria,
        description: "refeições/dia",
      },
      {
        id: "refeicoes-manuais",
        label: "Refeições Manuais",
        bgColor: "purple.main",
        icon: <PaperIcon color="#8200DB" />,
        value: resumo.totalManuais,
      },
    ]
    : null;

  return (
    <>
      {error && <ReportErrorState message={error} onRetry={load} isRetrying={isLoading} />}

      <ReportSection
        id="dashboard-kpis"
        title="Indicadores dos últimos 7 dias"
        description={`Período fixo: ${PERIODO_LABEL}`}
        plain
        action={
          <Select
            label="Unidade"
            options={unitOptions}
            value={unidadeId}
            onChange={setUnidadeId}
            size="small"
            formControlSx={{ width: { xs: "100%", sm: 220 } }}
          />
        }>
        <Box
          display={"grid"}
          gap={3}
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          sx={{
            "& > :last-of-type:nth-of-type(odd)": {
              gridColumn: {
                sm: "1 / -1",
                md: "auto",
              },
            },
          }}>
          {isLoading || !kpis
            ? Array.from({ length: 3 }).map((_, index) => (
              <KPICardSkeleton key={index} />
            ))
            : kpis.map((card) => (
              <KPICard
                key={card.id}
                label={card.label}
                icon={card.icon}
                bgColor={card.bgColor}
                value={card.value}
                unit={card.unit}
                trend={card.trend}
                description={card.description}
              />
            ))}
        </Box>
      </ReportSection>

      <ReportSection id="dashboard-evolucao" title="Evolução diária" plain>
        <Vertical7DaysChart data={chartData} isLoading={isLoading} />
      </ReportSection>

      <ReportSection id="dashboard-rankings" title="Rankings do período" plain>
        <Stack
          direction={"row"}
          maxWidth={"100%"}
          gap={2}
          flexWrap={"wrap"}
          justifyContent={"space-between"}>
          <RankingChart
            title="Top 5 Tipos de Refeição"
            data={rankingTipos}
            isLoading={isLoading}
          />
          <RankingChart
            title="Distribuição por Unidade"
            data={rankingUnidades}
            barColor="info.contrastText"
            isLoading={isLoading}
          />
        </Stack>
      </ReportSection>
    </>
  );
}
