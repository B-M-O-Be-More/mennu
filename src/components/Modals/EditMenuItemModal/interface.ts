import { IMenuItems } from "@/Interfaces/Menu/menu";
import { CreateMenuItemSchemaFormData } from "@/schemas/menuSchema";

export interface EditMenuItemModalProps {
  open: boolean;
  onClose: () => void;
  menuItem: IMenuItems;
  onSave: (updatedMenu: CreateMenuItemSchemaFormData) => void;
}
