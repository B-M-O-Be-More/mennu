import { mockStatuses } from "@/data/menuItems";
import * as yup from "yup";
import { normalizeTime, timeRegex } from "@/utils/normalizeTime";

export const MealTypeSchema = yup.object({
  typeName: yup.string().required("O nome da refeição é obrigatório"),
  description: yup.string().required("A descrição é obrigatória"),
  startTime: yup
    .string()
    .transform((value) => normalizeTime(value))
    .matches(timeRegex, "Formato inválido")
    .optional(),
  endTime: yup
    .string()
    .transform((value) => normalizeTime(value))
    .matches(timeRegex, "Formato inválido")
    .optional(),
  status: yup
    .string()
    .oneOf(mockStatuses.map((status) => status.value))
    .optional(),
  units: yup
    .array()
    .of(yup.string().required())
    .min(1, "Selecione pelo menos uma unidade")
    .required(),
  validations: yup.array().of(yup.string().required()).optional(),
});

export type MealTypeInput = yup.InferType<typeof MealTypeSchema>;
