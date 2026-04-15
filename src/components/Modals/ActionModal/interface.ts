export interface ActionModalProps {
  open: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  cancelLabel?: string;
  color?: "primary" | "error" | "warning" | "info" | "success" | "default" | "purple" | "pink";
  onConfirm: () => void;
  onCancel?: () => void;
}
