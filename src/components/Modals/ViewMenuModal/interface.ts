import { IMenu } from "@/Interfaces/Menu/menu";

export interface ViewMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IMenu;
}
