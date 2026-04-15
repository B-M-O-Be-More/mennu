import { AlertColor } from "@mui/material";

export interface MealTypesTabProps {
	refreshKey?: number;
	onNotify?: (message: string, severity?: AlertColor) => void;
}
