import * as yup from "yup";
export const resetPasswordSchema = yup.object(
  {
    email: yup
      .string()
      .required("E-mail obrigatório")
      .email("Formato de e-mail inválido"),
  }
);

export type ResetPasswordSchemaFormData = yup.InferType<typeof resetPasswordSchema>;