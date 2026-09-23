import type { Control, FieldValues, Path } from "react-hook-form";

export interface CreatableCategorySelectProps<
  TFieldValues extends FieldValues,
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  enabled: boolean;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
}
