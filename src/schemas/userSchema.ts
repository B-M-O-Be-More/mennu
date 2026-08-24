import { mockStatuses } from "@/data/menuItems";
import { CATEGORIA_USUARIO_OPTIONS } from "@/Interfaces/Terminal/terminal";
import * as yup from "yup";

export const createUserSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  documento: yup
    .string()
    .required("O documento é obrigatório")
    .test(
      "documento-length",
      "O documento (CPF) deve conter 11 dígitos",
      (value) => !!value && value.replace(/\D/g, "").length === 11,
    ),

  matricula: yup
    .string()
    .required("A matrícula é obrigatória"),

  unidade_id: yup
    .string()
    .required("A unidade é obrigatória"),

  categoria_usuario: yup
    .string()
    .required("A categoria é obrigatória")
    .oneOf(CATEGORIA_USUARIO_OPTIONS.map((c) => c.value), "Categoria inválida"),

  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(mockStatuses.map((s) => s.value), "Status inválido"),

  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),

  numero_cartao: yup
    .string()
    .default("")
    .test(
      "numero-cartao-digits",
      "O número do cartão deve conter apenas dígitos",
      (value) => !value || /^\d+$/.test(value),
    ),

  email: yup
    .string()
    .default("")
    .test(
      "email-format",
      "E-mail inválido",
      (value) => !value || yup.string().email().isValidSync(value),
    ),

  telefone: yup
    .string()
    .default(""),
});

export type CreateUserSchemaFormData = yup.InferType<typeof createUserSchema>;
