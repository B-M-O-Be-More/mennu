import * as yup from "yup";

export const createMovementSchema = yup.object({
  tipo: yup
    .mixed<"entrada" | "saida" | "perda" | "inventario">()
    .oneOf(["entrada", "saida", "perda", "inventario"], "Tipo inválido")
    .required("Tipo é obrigatório"),
  item: yup
    .string()
    .required("O item é obrigatório"),
  quantidade: yup
    .number()
    .typeError("Quantidade deve ser numérica")
    .required("A quantidade é obrigatória")
    .positive("Quantidade deve ser maior que zero"),
  responsavel: yup
    .string()
    .required("O responsável é obrigatório")
    .min(3, "Nome do responsável deve ter pelo menos 3 caracteres"),
  justificativa: yup
    .string()
    .default("")
    .when("tipo", {
      is: (val: string) => val === "perda" || val === "inventario",
      then: schema => schema.required("Justificativa obrigatória para perdas e ajustes"),
      otherwise: schema => schema.notRequired(),
    }),
});

export type CreateMovementSchemaFormData = yup.InferType<typeof createMovementSchema>;
