"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Card from "../../Cards/Card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { Vertical7DaysChartProps } from "./interface";

ChartJS.register(
  CategoryScale,
  BarElement,
  Tooltip,
  LinearScale,
  ChartDataLabels,
);

export function Vertical7DaysChart({ values }: Vertical7DaysChartProps) {
  const theme = useTheme();
  const maxValue = 100;

  const data = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: values,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 12,
        stack: "progress",
        grouped: false,
      },
      {
        data: Array(7).fill(100),
        backgroundColor: theme.palette.divider,
        borderRadius: 12,
        stack: "progress",
        grouped: false,
      },
    ],
  };

  const options = {
    indexAxis: "x" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        filter: function (tooltipItem: TooltipItem<"bar">) {
          return tooltipItem.datasetIndex === 0;
        },
      },
      datalabels: {
        display: true,
        formatter: (value: number, context: Context) => {
          return context.datasetIndex === 0 ? value : null;
        },
        color: theme.palette.primary.contrastText,
        font: { size: 14, weight: "bold" as const },
        anchor: "center" as const,
        align: "center" as const,
      },
    },
    scales: {
      x: {
        max: maxValue,
        stacked: true,
        grid: { display: false },
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 16 },
        },
      },
      y: {
        display: false,
        stacked: false,
      },
    },
  };

  return (
    <Card sx={{ px: 1 }} gap={2}>
      <Typography variant="h6" fontWeight={400} color="text.primary" pl={1}>
        Refeições nos últimos 7 dias
      </Typography>
      <Box
        height={300}
        maxWidth={"100%"}
        position={"relative"}
        sx={{
          "& canvas": {
            display: "block",
            width: "100% !important",
            height: "100% !important",
          },
        }}>
        <Bar data={data} options={options} />
      </Box>
    </Card>
  );
}
