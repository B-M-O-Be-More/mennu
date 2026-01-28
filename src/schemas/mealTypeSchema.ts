import { mockStatuses } from "@/data/menuItems";
import * as yup from "yup";
import { normalizeTime } from "@/utils/normalizeTime";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const MealTypeSchema = yup.object({
  typeName: yup.string().required("O nome da refeição é obrigatório"),
  description: yup.string().required("A descrição obrigatória"),
  startTime: yup
    .string()
    .transform((value) => normalizeTime(value))
    .matches(timeRegex, "Formato inválido. Use HH:mm")
    .optional(),
  endTime: yup
    .string()
    .transform((value) => normalizeTime(value))
    .matches(timeRegex, "Digite um horário no formato HH:mm")
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
