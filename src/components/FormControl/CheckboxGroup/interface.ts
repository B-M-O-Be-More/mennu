import { SxProps, Theme } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";

export interface CheckboxGroupProps {
  label?: string;
  sublabel?: string;
  optional?: boolean;
  options: { id: string, label: string }[];
  sx?: SxProps<Theme>;
  error?: string;
  register?: UseFormRegisterReturn;
}
