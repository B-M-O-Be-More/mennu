import { IMenu } from "@/Interfaces/Menu/menu";
import { CreateMenuSchemaFormData } from "@/schemas/menuSchema";

export interface EditMenuModalProps {
  open: boolean;
  onClose: () => void;
  menu: IMenu;
  onSave: (updatedMenu: CreateMenuSchemaFormData) => void;
}
