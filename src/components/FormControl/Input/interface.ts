import {
  SxProps,
  Theme,
  TextFieldProps
} from "@mui/material";


export type InputProps = TextFieldProps & {
  label?: string;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
};