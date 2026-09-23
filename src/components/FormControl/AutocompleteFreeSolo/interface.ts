import { Control } from "react-hook-form";

export interface AutocompleteFreeSoloProps {
  label?: string;
  labelIcon?: React.ReactNode;
  optional?: boolean;
  placeholder?: string;
  options: string[];
  loading?: boolean;
  error?: string;
  description?: string;
  disabled?: boolean;
  name: string;
  control: Control<any>;
}
