import { TextFieldProps } from "@mui/material";

export type InputProps = TextFieldProps & {
  label?: string;
  startIcon?: React.ReactNode;
};
