export interface NewTerminalModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}
