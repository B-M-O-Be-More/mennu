export interface KPICardProps {
  icon: React.ReactNode;
  bgColor?: string;
  label: string;
  value: number | string;
  trend?: number;
  description?: string;
}
