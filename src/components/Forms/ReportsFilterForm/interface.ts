import { Dayjs } from "dayjs";

export interface ReportsFilterFormFields {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  user: string;
  mealType: string;
  unit: string;
  terminal: string;
  search: string;
}
