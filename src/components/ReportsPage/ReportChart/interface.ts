export interface ReportChartPoint {
  label: string;
  value: number;
}

export interface ReportChartProps {
  tipo: string;
  titulo: string;
  pontos: ReportChartPoint[];
}
