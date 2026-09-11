import * as yup from "yup";

export const safetySettingsSchema = yup.object({
  SessionTime: yup
    .number()
    .typeError("O tempo de sessão deve ser numérico")
    .required("O tempo de sessão é obrigatório")
    .min(5, "O tempo de sessão deve ser de pelo menos 5 minutos")
    .max(1440, "O tempo de sessão deve ser de no máximo 1440 minutos"),

  MaxLoginAttempts: yup
    .number()
    .typeError("O número máximo de tentativas deve ser numérico")
    .required("O número máximo de tentativas é obrigatório")
    .min(1, "Deve permitir pelo menos 1 tentativa")
    .max(20, "Deve permitir no máximo 20 tentativas"),

  TwoFactorAuth: yup
    .boolean()
    .required("O campo 'TwoFactorAuth' é obrigatório"),

  ActivityLog: yup
    .boolean()
    .required("O campo 'ActivityLog' é obrigatório"),
});

export type SafetySettingsFormData = yup.InferType<typeof safetySettingsSchema>;
