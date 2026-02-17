import { IMenuItems } from "@/Interfaces/Menu/menu";
import { CreateMenuItemSchemaFormData, CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

export interface MealsStepProps {
  registerSearch: UseFormRegister<{ menuItemSearch: string }>;
  filteredItems: IMenuItems[];
  watchRefeicoes: CreateMenuItemSchemaFormData[] | undefined;
  setValue: UseFormSetValue<CreateMenuSchemaFormData>;
  reset: UseFormReset<CreateMenuSchemaFormData>;
  errors: FieldErrors<CreateMenuSchemaFormData>;
  setCurrentStep: (step: number) => void;
}
