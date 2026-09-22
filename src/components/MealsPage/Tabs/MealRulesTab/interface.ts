import { AlertColor } from "@mui/material";

export interface MealRulesTabProps {
  refreshKey?: number;
  onNotify?: (message: string, severity?: AlertColor) => void;
}
