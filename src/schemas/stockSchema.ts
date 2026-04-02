import { mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import * as yup from "yup";

export const createStockSchema = yup.object({
  nome: yup.string().required("O nome do insumo é obrigatório"),
  categoria: yup.string().optional(),
  tipo_padrao: yup.string().optional(),
  unidade_medida: yup
    .string()
    .required("A unidade de medida é obrigatória")
    .oneOf(
      mockUnidadesMedida.slice(1).map((u) => u.value),
      "Unidade de medida inválida",
    ),
  ponto_reposicao: yup
    .number()
    .typeError("Ponto de reposição deve ser numérico")
    .optional(),
  unidade_id: yup.number().typeError("Unidade deve ser um número").optional(),
  quantidade_atual: yup
    .number()
    .typeError("Quantidade atual deve ser numérica")
    .required("A quantidade atual é obrigatória"),
});

export type CreateStockSchemaFormData = yup.InferType<typeof createStockSchema>;
