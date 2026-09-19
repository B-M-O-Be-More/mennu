// GenericBarChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";
import { BarChartProps } from "./";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function BarChart({ labels, datasets, title }: BarChartProps) {
  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
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
      }}
    >
      <Bar data={data} options={options} />
    </Box>
  );
}
