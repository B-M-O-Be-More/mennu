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
  responsavelId: yup.string().required("Selecione o responsável"),
  ativo: yup.string().oneOf(["ativo", "inativo"]).required("Selecione o status"),
});

export type CreateUnitSchemaFormData = yup.InferType<typeof createUnitSchema>;
