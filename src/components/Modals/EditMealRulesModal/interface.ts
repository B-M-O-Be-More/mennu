import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";

export interface EditMealRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MealRuleResponse;
  id: string;
}
