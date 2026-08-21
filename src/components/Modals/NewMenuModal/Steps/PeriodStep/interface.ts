import { CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import { FieldErrors, UseFormTrigger, Control, UseFormSetValue } from "react-hook-form";

export interface PeriodStepProps {
  errors: FieldErrors<CreateMenuSchemaFormData>;
  trigger: UseFormTrigger<CreateMenuSchemaFormData>;
  onClose: () => void;
  setCurrentStep: (step: number) => void;
  control: Control<CreateMenuSchemaFormData>;
  setValue: UseFormSetValue<CreateMenuSchemaFormData>;
}