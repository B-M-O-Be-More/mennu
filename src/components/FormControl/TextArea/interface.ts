import { SxProps, Theme } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

export interface TextAreaProps {
  label?: string;
  sublabel?: string;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  rows?: number;
  maxRows?: number;
  error?: string;
  register?: UseFormRegisterReturn;
}
