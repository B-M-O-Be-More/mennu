import { UseFormRegisterReturn } from "react-hook-form";
import { SxProps, Theme } from "@mui/material";

export interface SelectGProps<T> {
  label?: string;
  optional?: boolean;
  onChange?: (value: T) => void;
  options: { label: string; value: T }[];
  register?: UseFormRegisterReturn;
  error?: string;
  formControlSx?: SxProps<Theme>;
  selectSx?: SxProps<Theme>;
}
