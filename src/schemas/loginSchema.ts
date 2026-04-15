import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("O e-mail é obrigatório")
    .email("Formato de e-mail inválido"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginSchemaFormData = yup.InferType<typeof loginSchema>;