import * as yup from "yup";

export const createTerminalSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório").min(3, "Mínimo 3 caracteres"),
  tipo: yup.string().required("O tipo é obrigatório"),
  unidade_id: yup.number().required("A unidade é obrigatória").positive("Selecione uma unidade"),
  refeicoes_permitidas: yup.array(yup.number().required()).default([]),
  categorias_permitidas: yup.array(yup.string().required()).default([]),
  descricao: yup.string().optional().default(""),
});

export type CreateTerminalFormData = yup.InferType<typeof createTerminalSchema>;
