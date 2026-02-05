import * as yup from "yup";
import { Dayjs } from "dayjs";

export const MealTypeSchema = yup.object({
  typeName: yup.string().required("O nome da refeição é obrigatório"),
  description: yup.string().required("A descrição é obrigatória"),
  startTime: yup
    .mixed<Dayjs>()
    .nullable(),
  endTime: yup
    .mixed<Dayjs>()
    .nullable(),
  status: yup
    .string()
    .optional()
    .notOneOf(["1"], "Selecione um status válido"),
  units: yup
    .array()
    .of(yup.string().required())
    .min(1, "Selecione pelo menos uma unidade")
    .required(),
  validations: yup.array().of(yup.string().required()).optional(),
});

export type MealTypeInput = yup.InferType<typeof MealTypeSchema>;
