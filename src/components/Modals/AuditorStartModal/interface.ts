import { IStockAudit } from "@/Interfaces/StockAudit/stockAudit";

export interface AuditorStartModalProps {
  open: boolean;
  onClose: () => void;
  /** Linha da listagem; o checklist completa unidade, data e pendentes. */
  audit: IStockAudit | null;
}
