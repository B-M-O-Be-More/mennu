import {
  SxProps,
  Theme
} from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";


export interface InputProps {
  label?: string;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  register?: UseFormRegisterReturn;
}