import { IProfilePermissions } from "@/Interfaces/ProfilePermissions/ProfilePermissions";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface EditPermissionProfileModalProps {
  open: boolean;
  onClose: () => void;
  profilePermissions: IProfilePermissions;
  onSave: (updatedProfile: Partial<IProfilePermissions>) => void;
}
