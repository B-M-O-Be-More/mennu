// GenericLineChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChartProps } from "./";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ labels, datasets, title }: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((set) => ({
      ...set,
      backgroundColor: set.borderColor,
      tension: 0.3,
      pointRadius: 3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: !!title, text: title },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={data} options={options} />;
}
