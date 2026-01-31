import * as yup from "yup";
import { mockTipoUsuario } from "@/data/menuItems";

export const createMovementSchema = yup.object({
  data: yup
    .string()
    .required("A data é obrigatória")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)"),
  tipo: yup
    .mixed<"entrada" | "saida" | "perda" | "ajuste">()
    .oneOf(["entrada", "saida", "perda", "ajuste"], "Tipo inválido")
    .required("Tipo é obrigatório"),
  item: yup
    .string()
    .required("O item é obrigatório")
    .oneOf(mockTipoUsuario.slice(1).map(c => c.value), "Categoria inválida"),
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
      is: (val: string) => val === "perda" || val === "ajuste",
      then: schema => schema.required("Justificativa obrigatória para perdas e ajustes"),
      otherwise: schema => schema.notRequired(),
    }),
});

    export type CreateMovementSchemaFormData = yup.InferType<typeof createMovementSchema>;