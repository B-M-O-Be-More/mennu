import { UseFormRegisterReturn } from "react-hook-form";
import { SxProps, Theme } from "@mui/material";

export interface InputProps {
  label?: string;
  labelIcon?: React.ReactNode;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  register?: UseFormRegisterReturn;
  helperText?: string;
}
