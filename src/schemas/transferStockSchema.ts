import * as yup from "yup";

export const transferStockSchema = yup.object({
  unidadeDestinoId: yup.string().required("Selecione a unidade de destino"),
  movimentacoes: yup
    .array()
    .of(
      yup.object({
        insumoId: yup.string().required("Selecione o item"),
        quantidade: yup
          .number()
          .typeError("Informe uma quantidade válida")
          .moreThan(0, "A quantidade deve ser maior que zero")
          .required("Informe a quantidade"),
      }),
    )
    .min(1, "Adicione ao menos um item")
    .required("Adicione ao menos um item"),
});

export type TransferStockSchemaFormData = yup.InferType<typeof transferStockSchema>;
