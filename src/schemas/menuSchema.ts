import * as yup from "yup";
import { Dayjs } from "dayjs";

export const createMenuSchema = yup.object({
  vigencia: yup.object({
    inicio: yup.mixed<Dayjs>().required("Informe a data de início"),
    fim: yup.mixed<Dayjs>().nullable(),
  }),

  tipoIntervalo: yup
    .string()
    .required("O tipo de intervalo é obrigatório")
    .oneOf(["personalizado", "semanal"], "Tipo de intervalo inválido"),

  diasSemana: yup
    .array(
      yup.string().oneOf([
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado",
      ])
    )
    .required()
    .default([])
    .when("tipoIntervalo", {
      is: "semanal",
      then: schema => schema.min(1, "Selecione pelo menos um dia da semana"),
    }),

  unidade: yup
    .string()
    .required("A unidade é obrigatória"),

  tipo: yup
    .string()
    .required("O tipo de refeição é obrigatório"),

  numeroPrevistoRefeicoes: yup
    .number()
    .typeError("Informe um número válido")
    .min(0, "Não pode ser negativo")
    .integer("Deve ser um número inteiro")
    .default(0),

  observacao: yup
    .string()
    .default(""),
});

export type CreateMenuSchemaFormData = yup.InferType<typeof createMenuSchema>;

/**
 * `PUT /cardapio/{id}` só aceita data/previsto/observações — status muda só
 * pelas rotas dedicadas (`/confirmar`, `/servir`), e unidade/tipo de refeição
 * não são editáveis depois de criado.
 */
export const editMenuSchema = yup.object({
  dataRefeicao: yup.mixed<Dayjs>().required("Informe a data"),
  numeroPrevistoRefeicoes: yup
    .number()
    .typeError("Informe um número válido")
    .min(0, "Não pode ser negativo")
    .integer("Deve ser um número inteiro")
    .default(0),
  observacao: yup.string().default(""),
});

export type EditMenuSchemaFormData = yup.InferType<typeof editMenuSchema>;

export const createManualRegisterSchema = yup.object({
  usuario: yup
    .string()
    .required("Usuário é obrigatório")
    .notOneOf(["__select__"], "Usuário inválido"),

  menu: yup
    .string()
    .required("Cardápio é obrigatório")
    .notOneOf(["__select__"], "Cardápio inválido"),

  motivo: yup
    .string()
    .required("Motivo é obrigatório")
    .min(3, "Motivo deve ter pelo menos 3 caracteres"),
  restricoes: yup.array(yup.string()).default([]),
});

export type CreateManualRegisterSchemaFormData = yup.InferType<typeof createManualRegisterSchema>;

