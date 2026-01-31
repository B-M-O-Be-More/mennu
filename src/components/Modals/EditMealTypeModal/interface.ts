import { MealTypeResponse } from "@/Interfaces/Meals/MealTypes";

export interface EditMealTypeModalProps {
  open: boolean;
  onClose: () => void;
  typeId: string;
  initialData: MealTypeResponse;
}
