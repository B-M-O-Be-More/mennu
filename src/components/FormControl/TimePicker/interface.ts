import { Control } from "react-hook-form";

export interface TimePickerProps {
  label: string;
  name: string;
  control?: Control<any>;
}
