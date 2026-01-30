import * as yup from "yup";
import { dateRegex, normalizeDate } from "@/utils/normalizeDate";
import { normalizeTime, timeRegex } from "@/utils/normalizeTime";

export const mealRecordSchema = yup.object({
  user: yup.string().required().notOneOf(["1"], "Usuário inválido"),
  mealType: yup
    .string()
    .required()
    .notOneOf(["1"], "Tipo inválido"),
  date: yup
    .string()
    .transform((value) => normalizeDate(value))
    .matches(dateRegex, "Formato inválido. Use DD/MM/AAAA")
    .optional(),
  time: yup
    .string()
    .transform((value) => normalizeTime(value))
    .matches(timeRegex, "Formato inválido. Use HH:mm")
    .optional(),
  reason: yup.string().required("Motivo é obrigatório"),
});

export type MealRecordInput = yup.InferType<typeof mealRecordSchema>;

export type ManualMealRecord = MealRecordInput & {
  isManual: true
}
