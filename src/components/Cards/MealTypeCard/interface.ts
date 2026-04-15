import { MealTypeResponse } from "@/Interfaces/Meals/MealTypes";
import { AlertColor } from "@mui/material";

export interface MealTypeCardProps {
  type: MealTypeResponse;
  onUpdated?: () => void;
  onNotify?: (message: string, severity?: AlertColor) => void;
}
