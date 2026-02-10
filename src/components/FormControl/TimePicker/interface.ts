import { Control } from "react-hook-form";

export interface TimePickerProps {
  label: string;
  labelIcon?: React.ReactNode;
  name: string;
  control?: Control<any>;
}
