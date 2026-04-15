import * as yup from "yup";
import { Dayjs } from "dayjs";

export const mealRecordSchema = yup.object({
  user: yup.string().required().notOneOf(["__select__"], "Usuário inválido"),
  mealType: yup.string().required().notOneOf(["__select__"], "Tipo inválido"),
  date: yup.mixed<Dayjs>().nullable(),
  time: yup.mixed<Dayjs>().nullable(),
  reason: yup.string().required("Motivo é obrigatório"),
});

export type MealRecordInput = yup.InferType<typeof mealRecordSchema>;
