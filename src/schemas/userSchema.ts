import { mockStatuses } from "@/data/menuItems";
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

  // A criação vincula o usuário a uma unidade só; a API recebe o id dela.
  unidade_id: yup
    .string()
    .required("A unidade é obrigatória"),

  // O cargo (perfil de permissões) é opcional: sem ele o usuário nasce apenas
  // com o acesso da categoria. Vazio = nenhum cargo selecionado.
  cargo_id: yup
    .string()
    .default(""),

  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(mockStatuses.map((s) => s.value), "Status inválido"),

  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),

  // Aceita separadores ("1250458-25"), como o placeholder do campo sugere: o
  // envio já normaliza para dígitos. Só barra letras e afins.
  numero_cartao: yup
    .string()
    .default("")
    .test(
      "numero-cartao-digits",
      "O número do cartão deve conter apenas dígitos",
      (value) => !value || /^\d+$/.test(value.replace(/\D/g, "")),
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

export const editUserSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  matricula: yup
    .string()
    .required("A matrícula é obrigatória"),

  password: yup
    .string()
    .default("")
    .test(
      "password-min-length",
      "A senha deve ter pelo menos 6 caracteres",
      (value) => !value || value.length >= 6,
    ),

  numero_cartao: yup
    .string()
    .default("")
    .test(
      "numero-cartao-digits",
      "O número do cartão deve conter apenas dígitos",
      (value) => !value || /^\d+$/.test(value.replace(/\D/g, "")),
    ),

  email: yup
    .string()
    .default("")
    .test(
      "email-format",
      "E-mail inválido",
      (value) => !value || yup.string().email().isValidSync(value),
    ),
});

export type EditUserSchemaFormData = yup.InferType<typeof editUserSchema>;
