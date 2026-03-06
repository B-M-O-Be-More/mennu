export interface ReportsConsumptionHistoryItem {
  isManual?: boolean;
  usuario: string;
  data_hora: string;
  terminal: string;
  tipo: string;
  unidade: string;
  matricula: string;
  status: "Servida" | "Cancelada";
}
