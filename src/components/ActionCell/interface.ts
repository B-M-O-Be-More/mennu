import { SxProps } from "@mui/material";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ActionCellProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  tooltipToggle: string;
  onEdit?: () => void;
  tooltipEdit: string;
  switchSize?: "small" | "medium";
  sxProps?: SxProps;
}
