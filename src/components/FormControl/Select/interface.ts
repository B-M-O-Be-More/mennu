import { SxProps, Theme } from "@mui/material";

export interface SelectGProps<T> {
  label?: string;
  optional?: boolean;
  onChange?: (value: T) => void;
  options: { label: string; value: T }[];
  register?: ReturnType<any>;
  error?: string;
  formControlSx?: SxProps<Theme>;
  selectSx?: SxProps<Theme>;
}
