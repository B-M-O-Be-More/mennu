import * as yup from "yup";

// Validação para pedir o reset
export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .required("E-mail obrigatório")
    .email("Formato de e-mail inválido"),
});

export type ResetPasswordSchemaFormData = yup.InferType<typeof resetPasswordSchema>;

// Validação para o formulário da nova senha (onde tem o token)
export const newPasswordSchema = yup.object({
  nova_senha: yup
    .string()
    .required("A nova senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .matches(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .matches(/[0-9]/, "Deve conter pelo menos um número")
    .matches(/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\.\<\>\/\?\|\\`\~]/, "Deve conter pelo menos um caractere especial"),
  confirmar_senha: yup
    .string()
    .required("A confirmação da senha é obrigatória")
    .oneOf([yup.ref('nova_senha')], "As senhas não coincidem"),
});

export type NewPasswordSchemaFormData = yup.InferType<typeof newPasswordSchema>;