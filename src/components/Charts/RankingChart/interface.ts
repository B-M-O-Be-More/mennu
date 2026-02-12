export interface RankingChartProps {
  title: string;
  data: { label: string; value: number }[];
  unit?: string;
  barColor?: string;
}
