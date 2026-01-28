import { SxProps } from "@mui/material";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ActionCellProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onEdit?: () => void;
  switchSize?: "small" | "medium";
  sxProps?: SxProps;
}
