import { mockTipoUsuario, mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import * as yup from "yup";

export const createStockSchema = yup.object({
  item: yup.string().required("O nome do item é obrigatório"),
  categoria: yup
    .string()
    .required("A categoria é obrigatória")
    .oneOf(mockTipoUsuario.slice(1).map(u => u.value), "Categoria inválida"),
  unidadeMedida: yup
    .string()
    .required("A unidade de medida é obrigatória")
    .oneOf(mockUnidadesMedida.slice(1).map(u => u.value), "Unidade de medida inválida"),
  saldo: yup
    .string()
    .required("O saldo inicial é obrigatório")
    .matches(/^\d+$/, "Saldo deve ser numérico"),
  estoqueMinimo: yup
    .string()
    .required("O estoque mínimo é obrigatório")
    .matches(/^\d+$/, "Estoque mínimo deve ser numérico"),
  unidade: yup
    .string()
    .required("A unidade é obrigatória")
    .oneOf(mockUnidades.slice(1).map(u => u.value), "Unidade inválida"),
  status: yup.boolean().required(),
});

export type CreateStockSchemaFormData = yup.InferType<typeof createStockSchema>;