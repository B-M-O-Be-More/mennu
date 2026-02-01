import * as yup from "yup";

export const mealRuleSchema = yup.object({
  dailyLimit: yup.number().required("Campo obrigatório"),
  weeklyLimit: yup.number().required("Campo obrigatório"),
  monthlyLimit: yup.number().required("Campo obrigatório"),
  minInterval: yup.number().required("Campo obrigatório"),
  isTimeRestricted: yup.boolean().optional(),
});

export type MealRuleInput = yup.InferType<typeof mealRuleSchema>;
