import { Control } from "react-hook-form";
import { Dayjs } from "dayjs"

export interface DatePickerProps {
  label: string;
  name: string;
  control?: Control<any>;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}
