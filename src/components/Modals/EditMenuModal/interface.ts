import { IMenu } from "@/Interfaces/Menu/menu";

export interface EditMenuModalProps {
  open: boolean;
  onClose: () => void;
  menu: IMenu;
  onSaved: () => void;
}
