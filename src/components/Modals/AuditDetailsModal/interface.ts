import { IStockAudit } from "@/Interfaces/StockAudit/stockAudit";

export interface AuditDetailsModalProps {
  open: boolean;
  onClose: () => void;
  /** Linha da listagem: dá o auditor e serve de fallback enquanto o checklist carrega. */
  audit: IStockAudit | null;
}
