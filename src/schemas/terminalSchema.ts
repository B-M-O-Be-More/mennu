import * as yup from "yup";

export const createTerminalSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  tipo: yup
    .string()
    .required("O tipo é obrigatório"),

  unidade_id: yup
    .number()
    .typeError("Selecione uma unidade")
    .required("A unidade é obrigatória"),
});

export type CreateTerminalSchemaFormData = yup.InferType<typeof createTerminalSchema>;
