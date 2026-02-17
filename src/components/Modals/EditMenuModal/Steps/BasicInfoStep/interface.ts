import { CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import { FieldErrors, UseFormRegister, UseFormTrigger } from "react-hook-form";

export interface BasicInfoStepProps {
  register: UseFormRegister<CreateMenuSchemaFormData>;
  errors: FieldErrors<CreateMenuSchemaFormData>;
  trigger: UseFormTrigger<CreateMenuSchemaFormData>;
  onClose: () => void;
  setCurrentStep: (step: number) => void;
}
