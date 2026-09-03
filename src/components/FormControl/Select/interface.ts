import { Control, UseFormRegisterReturn } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectGProps {
  label?: string;
  labelIcon?: React.ReactNode;
  optional?: boolean;
  options: SelectOption[];
  error?: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  formControlSx?: object;
  selectSx?: object;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  control?: Control<any>;
  register?: UseFormRegisterReturn;
}
