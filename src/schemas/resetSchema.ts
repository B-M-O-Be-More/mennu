import * as yup from "yup";
export const resetSchema = yup.object(
  {
    email: yup
      .string()
      .required("E-mail obrigatório")
      .email("Formato de e-mail inválido"),
  }
);