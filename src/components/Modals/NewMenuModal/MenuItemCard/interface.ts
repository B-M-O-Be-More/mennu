import { IMenuItems } from "@/Interfaces/Menu/menu";
import { CreateMenuItemSchemaFormData } from "@/schemas/menuSchema";

export interface MenuItemCardProps {
  item: IMenuItems;
  onSelect: (item: IMenuItems) => void
  selectedItems: number[];
}
