import * as yup from "yup";

export const TIPO_PRATO_OPTIONS = [
  { label: "Prato Principal", value: "principal" },
  { label: "Guarnição", value: "guarnicao" },
  { label: "Salada", value: "salada" },
  { label: "Sobremesa", value: "sobremesa" },
  { label: "Bebida", value: "bebida" },
];

export const RESTRICAO_ALIMENTAR_OPTIONS = [
  { id: "vegetariano", label: "Vegetariano" },
  { id: "vegano", label: "Vegano" },
  { id: "sem_gluten", label: "Sem Glúten" },
  { id: "sem_lactose", label: "Sem Lactose" },
];

export const addPratoSchema = yup.object({
  tipoPrato: yup
    .string()
    .required("O tipo de prato é obrigatório")
    .oneOf(TIPO_PRATO_OPTIONS.map((o) => o.value), "Tipo de prato inválido"),
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .max(150, "O nome deve ter no máximo 150 caracteres"),
  descricao: yup.string().default(""),
  restricoes: yup.array(yup.string().required()).default([]),
});

export type AddPratoSchemaFormData = yup.InferType<typeof addPratoSchema>;
