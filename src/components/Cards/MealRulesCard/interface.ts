import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";
import { MealRuleInput } from "@/schemas/mealRulesSchema";

export interface MealRulesCardProps {
    rule: MealRuleResponse;
    onSave?: (rule: MealRuleResponse, values: MealRuleInput) => Promise<void>;
}
