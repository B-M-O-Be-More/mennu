import { mockStatuses } from "@/data/menuItems";
import * as yup from "yup";

export const createPolicySchema = yup.object({
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
      .min(0, "O limite diário deve ser maior ou igual a zero")
      .required("Informe o limite diário"),
    semanal: yup
      .number()
      .min(0, "O limite semanal deve ser maior ou igual a zero")
      .required("Informe o limite semanal"),
    mensal: yup
      .number()
      .min(0, "O limite mensal deve ser maior ou igual a zero")
      .required("Informe o limite mensal"),
  }),
});

export type CreatePolicySchemaFormData = yup.InferType<typeof createPolicySchema>;

export const createUnitSchema = yup.object({
  nome: yup.string().required("O nome da unidade é obrigatório"),
  endereco: yup.string().required("O endereço é obrigatório"),
  responsavel: yup.string().required("O responsável é obrigatório"),
  ativo: yup.boolean().required(),
  horarioAbertura: yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato HH:mm inválido", excludeEmptyString: true })
    .default(""),
  horarioFechamento: yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato HH:mm inválido", excludeEmptyString: true })
    .default(""),
});

export type CreateUnitSchemaFormData = yup.InferType<typeof createUnitSchema>;

export const refeicaoItemSchema = yup.object({
  nome: yup.string().required("Informe o nome da refeição"),
  inicio: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato HH:mm inválido", excludeEmptyString: true })
    .required("Informe o horário de início"),
  fim: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Formato HH:mm inválido", excludeEmptyString: true })
    .required("Informe o horário de fim"),
  limiteDiario: yup.number().min(0).required(),
  limiteSemanal: yup.number().min(0).required(),
  limiteMensal: yup.number().min(0).required(),
});

export const unitPoliciesSchema = yup.object({
  refeicoes: yup.array().of(refeicaoItemSchema).required(),
  limiteAtivo: yup.boolean().required(),
});

export type UnitPoliciesFormData = yup.InferType<typeof unitPoliciesSchema>;