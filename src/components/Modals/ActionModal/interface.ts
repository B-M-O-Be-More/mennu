export interface ActionModalProps {
  open: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  color?: "primary" | "error" | "warning" | "info" | "success" | "default" | "purple" | "pink";
  onConfirm: () => void;
  onCancel?: () => void;
}
