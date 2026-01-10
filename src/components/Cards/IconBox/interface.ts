import { ReactNode } from "react";

export interface IconBoxProps {
  icon: ReactNode;
  bgColor?: string;
  padding?: number | string;
  borderRadius?: number | string;
  maxWidth?: string;
  maxHeight?: string;
}
