import { IUser } from "@/Interfaces/User/user";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
  onSave: (updatedUser: Partial<IUser>) => void;
}
