export interface NewStockAuditModalProps {
  open: boolean;
  onClose: () => void;
  /** Chamado após criar a auditoria — usado para recarregar a listagem. */
  onCreated?: () => void;
}
