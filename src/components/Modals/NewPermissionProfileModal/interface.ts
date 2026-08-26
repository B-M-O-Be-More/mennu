import { AlertColor } from "@mui/material";

export interface NewPermissionProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  onNotify?: (message: string, severity?: AlertColor, duration?: number) => void;
}
