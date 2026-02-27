import * as yup from "yup";
import { InferType } from "yup";

export const generalSettingsSchema = yup.object({
  systemName: yup.string().required("O nome do sistema é obrigatório"),
  description: yup.string().required("A descrição é obrigatória"),
  emailNotifications: yup.boolean().required(),
  maintenanceMode: yup.boolean().required(),
  image: yup.mixed<FileList>().nullable().defined(),
});

export type GeneralSettingsFormData = InferType<typeof generalSettingsSchema>;