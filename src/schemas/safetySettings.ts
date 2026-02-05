import * as yup from "yup";

export const safetySettingsSchema = yup.object({
  SessionTime: yup
    .number()
    .typeError("O tempo de sessão deve ser numérico")
    .required("O tempo de sessão é obrigatório")
    .min(1, "O tempo de sessão deve ser pelo menos 1 minuto"),

  MaxLoginAttempts: yup
    .number()
    .typeError("O número máximo de tentativas deve ser numérico")
    .required("O número máximo de tentativas é obrigatório")
    .min(1, "Deve permitir pelo menos 1 tentativa"),

  TwoFactorAuth: yup
    .boolean()
    .required("O campo 'TwoFactorAuth' é obrigatório"),

  ActivityLog: yup
    .boolean()
    .required("O campo 'ActivityLog' é obrigatório"),
});

export type SafetySettingsFormData = yup.InferType<typeof safetySettingsSchema>;
