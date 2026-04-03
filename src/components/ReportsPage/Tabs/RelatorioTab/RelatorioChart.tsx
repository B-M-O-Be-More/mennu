"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import BarChart from "@/components/Charts/BarChart";
import RankingChart from "@/components/Charts/RankingChart";
import { GraficoPreview } from "@/Interfaces/Reports/relatorios-api";

interface RelatorioChartProps {
  grafico: GraficoPreview;
}

/**
 * Renderiza o gráfico correto com base no tipo retornado pelo backend:
 * - "barra" | "linha" → BarChart (bar com labels dinâmicos)
 * - "barra_horizontal"  → RankingChart (bar horizontal / ranking)
 */
export default function RelatorioChart({ grafico }: RelatorioChartProps) {
  if (grafico.tipo === "barra_horizontal") {
    return (
      <RankingChart
        title={grafico.titulo}
        data={grafico.pontos.map((p) => ({ label: p.label, value: p.valor }))}
      />
    );
  }

  return (
    <Card sx={{ px: 1 }} gap={2}>
      <Typography variant="h6" fontWeight={400} color="text.primary" pl={1}>
        {grafico.titulo}
      </Typography>
      <Box height={300} maxWidth="100%" position="relative">
        <BarChart
          labels={grafico.pontos.map((p) => p.label)}
          datasets={[
            {
              label: grafico.titulo,
              data: grafico.pontos.map((p) => p.valor),
              backgroundColor: "#00A63E",
            },
          ]}
        />
      </Box>
    </Card>
  );
}
