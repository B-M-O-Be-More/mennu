import { Control } from "react-hook-form";
import { SelectOption } from "@/components/FormControl/Select/interface";

export interface MultiSelectProps {
  label?: string;
  labelIcon?: React.ReactNode;
  optional?: boolean;
  options: SelectOption[];
  error?: string;
  description?: string;
  disabled?: boolean;
  /** Texto quando nada está marcado — o campo não tem opção "nenhum". */
  placeholder?: string;
  formControlSx?: object;
  selectSx?: object;
  /** Uso controlado; com `control` + `name`, quem manda é o formulário. */
  value?: string[];
  onChange?: (value: string[]) => void;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  size?: "small" | "medium";
}
