import * as yup from "yup";

const limitField = (label: string) =>
  yup
    .number()
    .typeError("Informe um número válido")
    .min(0, `${label} não pode ser negativo`)
    .required("Campo obrigatório");

export const mealRuleSchema = yup.object({
  dailyLimit: limitField("O limite diário"),
  weeklyLimit: limitField("O limite semanal"),
  monthlyLimit: limitField("O limite mensal"),
  minInterval: limitField("O intervalo mínimo"),
  isTimeRestricted: yup
    .boolean()
    .required("O campo 'isTimeRestricted' é obrigatório"),
});

export type MealRuleInput = yup.InferType<typeof mealRuleSchema>;
