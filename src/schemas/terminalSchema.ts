import * as yup from "yup";

export const createTerminalSchema = yup.object({
  id: yup
    .string()
    .required("O ID é obrigatório"),

  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  codigo: yup
    .string()
    .required("O código é obrigatório"),

  unidade: yup
    .string()
    .required("A unidade é obrigatória"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório"),

  status: yup
    .mixed<"online" | "offline" | "desatualizado">()
    .oneOf(["online", "offline", "desatualizado"])
    .required("O status é obrigatório"),

  refeicoesPermitidas: yup
    .array(yup.string().required())
    .required("As refeições permitidas são obrigatórias"),

  categoriasPermitidas: yup
    .array(yup.string().required())
    .required("As categorias permitidas são obrigatórias"),

  ativo: yup
    .boolean()
    .required("O campo ativo é obrigatório"),
});

export type CreateTerminalSchemaFormData = yup.InferType<typeof createTerminalSchema>;