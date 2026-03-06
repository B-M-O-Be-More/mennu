import { CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import { Control, FieldErrors, UseFormRegister, UseFormTrigger } from "react-hook-form";

export interface BasicInfoStepProps {
  register: UseFormRegister<CreateMenuSchemaFormData>;
  errors: FieldErrors<CreateMenuSchemaFormData>;
  trigger: UseFormTrigger<CreateMenuSchemaFormData>;
  setCurrentStep: (step: number) => void;
  control: Control<CreateMenuSchemaFormData>;
}
