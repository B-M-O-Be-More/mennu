"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import Card from "@/components/Cards/Card";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import RankingChart from "@/components/Charts/RankingChart";
import { StatsIcon } from "@/components/Icons";
import { ReportChartProps } from "./interface";

/** Renderiza barra/barra_horizontal/linha conforme `grafico.tipo` do backend — mesmo switch usado no `ReportViewer` e no modal de preview, sem duplicar em cada consumidor. */
export function ReportChart({ tipo, titulo, pontos }: ReportChartProps) {
  const theme = useTheme();

  if (tipo === "barra_horizontal") {
    return <RankingChart title={titulo} data={pontos} unit="" />;
  }

  if (tipo === "linha") {
    return (
      <Card>
        <Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <StatsIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
            <Typography>{titulo}</Typography>
          </Stack>
        </Box>
        <LineChart
          labels={pontos.map((p) => p.label)}
          datasets={[{ label: titulo, data: pontos.map((p) => p.value), borderColor: "#FF3D00" }]}
          title={titulo}
        />
      </Card>
    );
  }

  return (
    <Card>
      <Box>
        <Stack direction="row" alignItems="center" gap={1}>
          <StatsIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
          <Typography>{titulo}</Typography>
        </Stack>
      </Box>
      <BarChart
        labels={pontos.map((p) => p.label)}
        datasets={[{ label: titulo, data: pontos.map((p) => p.value), backgroundColor: "#3B82F6" }]}
        title={titulo}
      />
    </Card>
  );
}
