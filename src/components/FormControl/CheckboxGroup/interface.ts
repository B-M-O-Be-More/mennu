import { SxProps, Theme } from "@mui/material";
import { Control } from "react-hook-form";

export interface CheckboxGroupProps {
  label?: string;
  sublabel?: string;
  optional?: boolean;
  options: { id: string; label: string }[];
  sx?: SxProps<Theme>;
  error?: string;
  name: string;
  control: Control<any>;
  disabled?: boolean;
}
