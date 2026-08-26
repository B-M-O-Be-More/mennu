import { AlertColor } from "@mui/material";
import { IProfilePermissions } from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface AddUsersToCargoModalProps {
  open: boolean;
  onClose: () => void;
  profile: IProfilePermissions | null;
  onAdded?: () => void;
  onNotify?: (message: string, severity?: AlertColor, duration?: number) => void;
}
