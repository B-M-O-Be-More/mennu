import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  TooltipItem
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Last7DaysChartProps } from "./interface";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Last7DaysChart({ data }: Last7DaysChartProps) {
  const theme = useTheme();
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: theme.palette.primary.main,
        borderRadius: 6,
        barThickness: 6,
        stack: "progress",
        grouped: false,
      },
      {
        data: Array(data.length).fill(maxValue),
        backgroundColor: theme.palette.divider,
        borderRadius: 6,
        barThickness: 10,
        stack: "progress",
        grouped: false,
      },

    ],
  };

  const options = {
    indexAxis: "y" as const,
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
    },
    scales: {
      x: {
        display: false,
        max: maxValue,
        stacked: false,
      },
      y: {
        stacked: false,
        grid: { display: false },
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <Box
      height={220}
      maxWidth={"100%"}
      position={"relative"}
      sx={{
        "& canvas": {
          display: "block",
          width: "100% !important",
          height: "100% !important",
        },
      }}
    >
      <Bar data={chartData} options={options} />
    </Box>
  );
}
