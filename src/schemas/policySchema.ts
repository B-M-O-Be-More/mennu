import * as yup from "yup";

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const editAccessPolicySchema = yup.object({
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
      .matches(timeRegex, "Formato inválido, use HH:mm entre 00:00 e 23:59"),
    horarioFim: yup
      .string()
      .required("O horário final é obrigatório")
      .matches(timeRegex, "Formato inválido, use HH:mm entre 00:00 e 23:59")
      .test(
        "is-after-start",
        "O horário final deve ser maior que o inicial",
        function (value) {
          const { horarioInicio } = this.parent;

          const [hStart, mStart] = horarioInicio.split(":").map(Number);
          const [hEnd, mEnd] = value.split(":").map(Number);

          const startMinutes = hStart * 60 + mStart;
          const endMinutes = hEnd * 60 + mEnd;

          return endMinutes > startMinutes;
        }
      ),
  }),

  reservaObrigatoria: yup
    .boolean()
    .required("O campo 'reservaObrigatoria' é obrigatório"),
});

export type EditAccessPolicySchemaFormData = yup.InferType<typeof editAccessPolicySchema>;
