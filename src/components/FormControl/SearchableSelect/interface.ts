import type { SxProps, Theme } from "@mui/material";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { SelectOption } from "@/components/FormControl/Select/interface";

export interface SearchableSelectProps<
  TFieldValues extends FieldValues,
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  noOptionsText?: string;
  loadingText?: string;
  formControlSx?: SxProps<Theme>;
}
