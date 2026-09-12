export interface SendAuditModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itensConferidos: number;
  totalFotos: number;
  isSending?: boolean;
}
