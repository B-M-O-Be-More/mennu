import { IStockAudit } from "@/Interfaces/StockAudit/stockAudit";

export interface StockAuditPanelProps {
  /** Incremente para forçar uma recarga (botão "Atualizar" do header). */
  refreshToken?: number;
  /** Sem handler, o botão "Nova Auditoria" fica desabilitado ("Em breve"). */
  onNewAudit?: () => void;
  /** Sem handler, as ações da linha ficam desabilitadas ("Em breve"). */
  onOpenAudit?: (audit: IStockAudit) => void;
}
