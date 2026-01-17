import {
  SxProps,
  Theme
} from "@mui/material";


export interface InputProps {
  label?: string;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  register?: ReturnType<any>;
}