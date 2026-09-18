export interface NewUnitModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}
