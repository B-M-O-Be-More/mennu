import { mockCategoriaRefeicao, mockStatuses, mockTiposCardapio, mockUnidades } from "@/data/menuItems";
import { mockMenuTypes, mockUsuarios } from "@/data/menus";
import * as yup from "yup";

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
    .oneOf(mockCategoriaRefeicao.slice(1).map(t => t.value), "Categoria inválida"),

  status: yup
    .string()
    .required("O status da refeição é obrigatório")
    .oneOf(["ativo", "inativo"], "Status inválido"),
});

export type CreateMenuItemSchemaFormData = yup.InferType<typeof createMenuItemSchema>;

export const createMenuSchema = yup.object({
  data: yup
    .string()
    .required("A data é obrigatória")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "A data deve estar no formato DD/MM/AAAA"),

  unidade: yup
    .string()
    .required("A unidade é obrigatória")
    .oneOf(mockUnidades.slice(1).map(u => u.value), "Unidade inválida"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(mockTiposCardapio.slice(1).map(t => t.value), "Tipo inválido"),

  horario: yup.object({
    inicio: yup
      .string()
      .required("O horário de início é obrigatório")
      .matches(/^\d{2}:\d{2}$/, "O horário deve estar no formato HH:mm"),
    fim: yup
      .string()
      .required("O horário de fim é obrigatório")
      .matches(/^\d{2}:\d{2}$/, "O horário deve estar no formato HH:mm"),
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

