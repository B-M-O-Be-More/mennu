import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";
import { MealRuleInput } from "@/schemas/mealRulesSchema";

export interface EditMealRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MealRuleResponse;
  onSave?: (values: MealRuleInput) => Promise<void>;
}
