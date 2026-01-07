import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  TooltipItem
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@mui/material/styles";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Last7DaysChart() {
  const theme = useTheme();
  const maxValue = 10;

  const data = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: [2, 3, 1, 0, 4, 0, 2],
        backgroundColor: theme.palette.primary.main,
        borderRadius: 6,
        barThickness: 6,
        stack: "progress",
        grouped: false,
      },
      {
        data: Array(7).fill(maxValue),
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

  return <Bar data={data} options={options} />;
}
