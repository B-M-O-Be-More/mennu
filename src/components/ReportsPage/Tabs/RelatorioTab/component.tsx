"use client";

import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DownloadIcon } from "@/components/Icons";
import KPICard from "@/components/Cards/KPICard";
import KPICardSkeleton from "@/components/Skeletons/Cards/KPICardSkeleton";
import Vertical7DaysChartSkeleton from "@/components/Skeletons/Charts/Vertical7DaysChartSkeleton";
import RankingChartSkeleton from "@/components/Skeletons/Charts/RankingChartSkeleton";
import { StatsIcon } from "@/components/Icons";
import useAuthFetch from "@/hooks/useAuthFetch/hook";
import { RelatorioPreview } from "@/Interfaces/Reports/relatorios-api";
import { RelatorioModulo } from "@/config/relatorios-factory";
import RelatorioChart from "./RelatorioChart";

interface RelatorioTabProps {
  modulo: RelatorioModulo;
  dataInicio: string;
  dataFim: string;
}

export function RelatorioTab({
  modulo,
  dataInicio,
  dataFim,
}: RelatorioTabProps) {
  const [fetchPreview, isLoading] = useAuthFetch<RelatorioPreview>();
  const [preview, setPreview] = React.useState<RelatorioPreview | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
    setPreview(null);
    fetchPreview(`${modulo.previewEndpoint}/preview`, {
      method: "GET",
      params: { data_inicio: dataInicio, data_fim: dataFim },
    })
      .then((resp) => {
        if (resp.data) setPreview(resp.data);
      })
      .catch(() => setError(true));
  }, [modulo.id, dataInicio, dataFim]);

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" gap={1} py={8}>
        <StatsIcon height={40} />
        <Typography color="text.secondary">
          Não foi possível carregar os dados. Tente novamente mais tarde.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={3}>
      {/* KPI cards */}
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
          : preview?.resumo_cards.map((card) => (
              <KPICard
                key={card.label}
                label={card.label}
                value={Number(card.valor)}
                bgColor="primary.main"
                icon={null}
              />
            ))}
      </Box>

      {/* Chart */}
      {isLoading ? (
        preview?.grafico.tipo === "barra_horizontal" ? (
          <RankingChartSkeleton />
        ) : (
          <Vertical7DaysChartSkeleton />
        )
      ) : preview?.grafico ? (
        <RelatorioChart grafico={preview.grafico} />
      ) : null}

      {/* Export buttons */}
      {!isLoading && preview && (
        <Stack direction="row" gap={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon height={18} />}
            href={preview.links.csv}
            target="_blank"
            rel="noopener noreferrer">
            CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon height={18} />}
            href={preview.links.pdf}
            target="_blank"
            rel="noopener noreferrer">
            PDF
          </Button>
        </Stack>
      )}

      {!isLoading && !preview && !error && (
        <Stack alignItems="center" py={4}>
          <Typography color="text.secondary">
            Nenhum dado encontrado para o período selecionado.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
