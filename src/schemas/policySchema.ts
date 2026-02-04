import * as yup from "yup";

export const editIAccessPolicySchema = yup.object({
  permitirMultiplasRefeicoes: yup
    .boolean()
    .required("O campo 'permitirMultiplasRefeicoes' é obrigatório"),

  horarioFlexivel: yup.object({
    permitido: yup
      .boolean()
      .required("O campo 'permitido' é obrigatório"),
    horarioInicio: yup
      .string()
      .required("O horário inicial é obrigatório")
      .matches(/^\d{2}:\d{2}$/, "Formato inválido, use HH:mm"),
    horarioFim: yup
      .string()
      .required("O horário final é obrigatório")
      .matches(/^\d{2}:\d{2}$/, "Formato inválido, use HH:mm"),
  }),

  reservaObrigatoria: yup
    .boolean()
    .required("O campo 'reservaObrigatoria' é obrigatório"),
});

export type EditIAccessPolicySchemaFormData = yup.InferType<typeof editIAccessPolicySchema>;
