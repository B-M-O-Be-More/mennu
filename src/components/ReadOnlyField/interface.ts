import { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export interface ReadOnlyFieldProps {
  label: string;
  value: ReactNode;
  /** Centralizado como no design; textos longos ficam melhores à esquerda. */
  align?: "left" | "center" | "right";
  sx?: SxProps<Theme>;
}
