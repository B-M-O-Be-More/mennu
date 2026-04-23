import { Control, UseFormRegisterReturn } from "react-hook-form";

export interface SelectGProps {
  label?: string;
  optional?: boolean;
  options: { label: string; value: string; disabled?: boolean }[];
  error?: string;
  formControlSx?: object;
  selectSx?: object;
  name?: string;
  control?: Control<any>;
  register?: UseFormRegisterReturn;
  defaultValue?: string;
}
