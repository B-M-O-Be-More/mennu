import * as yup from "yup";

export const transferStockSchema = yup.object({
  unidadeDestinoId: yup.string().required("Selecione a unidade de destino"),
  insumoId: yup.string().required("Selecione o item"),
  quantidade: yup
    .number()
    .typeError("Informe uma quantidade válida")
    .moreThan(0, "A quantidade deve ser maior que zero")
    .required("Informe a quantidade"),
});

export type TransferStockSchemaFormData = yup.InferType<typeof transferStockSchema>;
