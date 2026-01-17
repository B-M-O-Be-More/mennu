import { mockCategorias, mockStatuses, mockUnidades } from "@/data/menuItems";
import * as yup from "yup";

export const userSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  CPF: yup
    .string()
    .required("O CPF é obrigatório")
    .matches(/^\d{11}$/, "O CPF deve conter exatamente 11 dígitos"),

  matricula: yup
    .string()
    .required("A matrícula é obrigatória"),

  categoria: yup
    .string()
    .required("A categoria é obrigatória")
    .oneOf(mockCategorias.map(u => u.value), "Categoria inválida"),

  unidade: yup
    .string()
    .required("A unidade é obrigatória")
    .oneOf(mockUnidades.map(u => u.value), "Unidade inválida"),

  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(mockStatuses.map(u => u.value), "Status inválido"),

  numeroCartao: yup
    .string()
    .required("O número do cartão é obrigatório")
    .matches(/^\d+$/, "O número do cartão deve conter apenas dígitos"),
});
