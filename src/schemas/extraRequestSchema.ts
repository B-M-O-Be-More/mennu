import { mockExtraRequestTypes, mockUnidades, mockUsers } from "@/data/menuItems";
import * as yup from "yup";

export const extraRequestSchema = yup.object({
  usuario: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(mockUsers.slice(1).map(u => u.value), "Usuário inválido"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(mockExtraRequestTypes.slice(1).map(u => u.value), "Tipo inválido"),

  motivo: yup
    .string()
    .required("O motivo é obrigatório"),
});

export const ReviewExtraRequestSchema = yup.object({
  review: yup
    .string()
    .required("A justificativa é obrigatória"),
});

