import { mockStatuses } from "@/data/menuItems";
import * as yup from "yup";

export const policySchema = yup.object({
  horarios: yup.object({
    cafeManha: yup.object({
      inicio: yup.string().required("Informe o início"),
      fim: yup.string().required("Informe o fim"),
    }),
    almoco: yup.object({
      inicio: yup.string().required("Informe o início"),
      fim: yup.string().required("Informe o fim"),
    }),
    jantar: yup.object({
      inicio: yup.string().required("Informe o início"),
      fim: yup.string().required("Informe o fim"),
    }),
  }),
  limites: yup.object({
    diario: yup
      .number()
      .min(0)
      .required("Informe o limite diário"),
    semanal: yup
      .number()
      .min(0)
      .required("Informe o limite semanal"),
    mensal: yup
      .number()
      .min(0)
      .required("Informe o limite mensal"),
  }),

});

export const unitSchema = yup.object({
  nome: yup.string().required("O nome da unidade é obrigatório"),
  endereco: yup.string().required("O endereço é obrigatório"),
  responsavel: yup.string().required("O responsável é obrigatório"),
  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(mockStatuses.slice(1).map(u => u.value), "Status inválido"),
  politicas: policySchema,
});