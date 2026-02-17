export interface KPICardProps {
  icon: React.ReactNode;
  bgColor?: string;
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  description?: string;
}
