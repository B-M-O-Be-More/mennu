import * as yup from "yup";

export const createTerminalSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  unidadeId: yup
    .string()
    .required("A unidade é obrigatória"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório"),

  refeicoesPermitidas: yup
    .array(yup.string().required())
    .required("As refeições permitidas são obrigatórias"),

  categoriasPermitidas: yup
    .array(yup.string().required())
    .required("As categorias permitidas são obrigatórias"),
});

export type CreateTerminalSchemaFormData = yup.InferType<typeof createTerminalSchema>;
