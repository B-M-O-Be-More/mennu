import { AlertColor } from "@mui/material";

export interface NewMealRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onNotify?: (message: string, severity?: AlertColor, duration?: number) => void;
}
