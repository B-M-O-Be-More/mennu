import { AlertColor } from "@mui/material";

export interface NewUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  onNotify?: (message: string, severity?: AlertColor, duration?: number) => void;
}
