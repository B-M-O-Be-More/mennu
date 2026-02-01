import { Control, UseFormRegisterReturn } from "react-hook-form";

export interface SelectGProps {
  label?: string;
  optional?: boolean;
  options: { label: string; value: string }[];
  error?: string;
  formControlSx?: object;
  selectSx?: object;
  name?: string;
  control?: Control<any>;
  register?: UseFormRegisterReturn;
}
