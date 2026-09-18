import * as yup from "yup";

export const addCardapioInsumoSchema = yup.object({
  insumoId: yup.string().required("Selecione o insumo"),
  quantidadePrevista: yup
    .number()
    .typeError("Informe uma quantidade válida")
    .moreThan(0, "A quantidade deve ser maior que zero")
    .required("Informe a quantidade prevista"),
});

export type AddCardapioInsumoSchemaFormData = yup.InferType<typeof addCardapioInsumoSchema>;
