import { SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  dialogSx?: SxProps;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}