import { mockTiposRefeicao, mockStatuses, mockTiposCardapio, mockUnidades } from "@/data/menuItems";
import { mockMenuTypes, mockUsuarios } from "@/data/menus";
import * as yup from "yup";
import { Dayjs } from "dayjs";

export const createMenuItemSchema = yup.object({
  id: yup
    .number()
    .required("O ID da refeição é obrigatório"),

  nome: yup
    .string()
    .required("O nome da refeição é obrigatório"),

  descricao: yup
    .string()
    .required("A descrição da refeição é obrigatória"),

  restricoes: yup
    .array(yup.string().required()).required("As restrições são obrigatórias"),

  categoria: yup
    .string()
    .required("A categoria é obrigatória")
    .oneOf(mockTiposRefeicao.slice(1).map(t => t.value), "Categoria inválida"),

  status: yup
    .string()
    .required("O status da refeição é obrigatório")
    .oneOf(["ativo", "inativo"], "Status inválido"),
});

export type CreateMenuItemSchemaFormData = yup.InferType<typeof createMenuItemSchema>;

export const createMenuSchema = yup.object({
  vigencia: yup.object({
    inicio: yup.mixed<Dayjs>(),
    fim: yup.mixed<Dayjs>().nullable(),
  }),

  unidade: yup
    .string()
    .required("A unidade é obrigatória")
    .oneOf(mockUnidades.slice(1).map(u => u.value), "Unidade inválida"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(mockTiposCardapio.slice(1).map(t => t.value), "Tipo inválido"),

  horario: yup.object({
    inicio: yup.mixed<Dayjs>(),
    fim: yup.mixed<Dayjs>(),
  }),

  refeicoes: yup
    .array(createMenuItemSchema)
    .min(1, "É necessário selecionar pelo menos uma refeição")
    .required("As refeições são obrigatórias"),

  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(mockStatuses.slice(1).map(s => s.value), "Status inválido"),

  observacao: yup
    .string()
    .required("A observação é obrigatória"),

  tipoIntervalo: yup
    .string()
    .required("O tipo de intervalo é obrigatório")
    .oneOf(["semanal", "Personalizado"], "Tipo de intervalo inválido"),

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

});

export type CreateMenuSchemaFormData = yup.InferType<typeof createMenuSchema>;

export const createManualRegisterSchema = yup.object({
  usuario: yup
    .string()
    .required("Usuário é obrigatório")
    .oneOf(mockUsuarios.slice(1).map(u => u.value), "Usuário inválido"),

  menu: yup
    .string()
    .required("Cardápio é obrigatório")
    .oneOf(mockMenuTypes.slice(1).map(m => m.value), "Cardápio inválido"),

  motivo: yup
    .string()
    .required("Motivo é obrigatório")
    .min(3, "Motivo deve ter pelo menos 3 caracteres"),
  restricoes: yup.array(yup.string()).default([]),
});

export type CreateManualRegisterSchemaFormData = yup.InferType<typeof createManualRegisterSchema>;

