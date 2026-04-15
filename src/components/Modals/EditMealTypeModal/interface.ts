import { MealTypeResponse } from "@/Interfaces/Meals/MealTypes";
import { AlertColor } from "@mui/material";

export interface EditMealTypeModalProps {
  open: boolean;
  onClose: () => void;
  typeId: string;
  initialData: MealTypeResponse;
  onSuccess?: () => void;
  onNotify?: (message: string, severity?: AlertColor) => void;
}
