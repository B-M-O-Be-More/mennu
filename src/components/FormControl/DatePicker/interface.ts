import { Control } from "react-hook-form";

export interface DatePickerProps {
  label: string;
  name: string;
  control?: Control<any>;
}
