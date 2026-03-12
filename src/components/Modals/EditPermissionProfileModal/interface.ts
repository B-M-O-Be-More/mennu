import { IProfilePermissions } from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface EditPermissionProfileModalProps {
  open: boolean;
  onClose: () => void;
  profilePermissions: IProfilePermissions;
  onSave: (updatedProfile: Partial<IProfilePermissions>) => void;
}
