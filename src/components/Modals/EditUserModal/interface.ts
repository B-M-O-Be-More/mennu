import { AlertColor } from "@mui/material";
import { IUsuarioListItem } from "@/Interfaces/User/user";

export interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  user: IUsuarioListItem | null;
  onNotify?: (message: string, severity?: AlertColor, duration?: number) => void;
}
