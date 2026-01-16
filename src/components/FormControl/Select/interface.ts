import { SxProps, Theme } from "@mui/material";


export interface SelectGProps<T> {
  label?: string;
  optional?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  formControlSx?: SxProps<Theme>;
  selectSx?: SxProps<Theme>;
}