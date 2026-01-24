import { ReactElement } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface MealValidationListProps {
  label?: string;
  options: {
    id: string;
    label: string;
    description: string;
    icon: ReactElement;
  }[];
  error?: string;
  register?: UseFormRegisterReturn;
}
