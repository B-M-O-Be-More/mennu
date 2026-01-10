import { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}