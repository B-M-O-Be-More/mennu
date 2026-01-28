import { SxProps, Theme } from "@mui/material";
import { Control } from "react-hook-form";

export interface SelectGProps<T> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  optional?: boolean;
  options: { label: string; value: string }[];
  formControlSx?: SxProps<Theme>;
  selectSx?: SxProps<Theme>;
  error?: string;
  name?: string;
  control?: Control<any>;
}
