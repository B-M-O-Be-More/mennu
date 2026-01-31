import { ValidationProps } from "@/Interfaces/Meals/MealTypes";
import { Control } from "react-hook-form";

export interface MealValidationListProps {
  label?: string;
  options: ValidationProps[];
  name: string;
  control: Control<any>;
  error?: string;
}
