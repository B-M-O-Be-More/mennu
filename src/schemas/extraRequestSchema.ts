import { mockExtraRequestTypes, mockUsers } from "@/data/menuItems";
import * as yup from "yup";
import { InferType } from "yup";

export const createExtraRequestSchema = yup.object({
  usuario: yup
    .string()
    .required("O usuário é obrigatório")
    .oneOf(mockUsers.slice(1).map(u => u.value), "Usuário inválido"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(mockExtraRequestTypes.slice(1).map(u => u.value), "Tipo inválido"),

  motivo: yup
    .string()
    .required("O motivo é obrigatório"),
});

export type CreateExtraRequestFormData = InferType<typeof createExtraRequestSchema>;

export const reviewExtraRequestSchema = yup.object({
  review: yup
    .string()
    .required("A justificativa é obrigatória"),
});

export type ReviewExtraRequestFormData = InferType<typeof reviewExtraRequestSchema>;
