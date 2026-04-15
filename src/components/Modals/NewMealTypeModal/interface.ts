import { AlertColor } from "@mui/material";

export interface NewMealTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onNotify?: (message: string, severity?: AlertColor) => void;
}