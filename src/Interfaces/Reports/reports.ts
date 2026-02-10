export interface ConsumptionHistoryItem {
  isManual?: boolean;
  usuario: string;
  data_hora: string;
  terminal: string;
  tipo: string;
  unidade: string;
  matricula: string;
  status: "Servida" | "Cancelada";
}
