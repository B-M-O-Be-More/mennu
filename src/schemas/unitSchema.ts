import * as yup from "yup";
import { UnitPoliciesFormValues } from "@/Interfaces/Settings/settings";
import { normalizeMealTypeName } from "@/utils/unitPoliciesUtils";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function timeInMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

const mealPolicySchema = yup.object({
  tipoRefeicaoId: yup.number().nullable().defined(),
  nome: yup.string().trim().required("Informe o nome"),
  horarioInicio: yup
    .string()
    .matches(TIME_PATTERN, "Informe um horário válido")
    .required("Informe o início"),
  horarioFim: yup
    .string()
    .matches(TIME_PATTERN, "Informe um horário válido")
    .required("Informe o fim")
    .test("after-start", "O fim deve ser posterior ao início", function (value) {
      const start = this.parent.horarioInicio as string | undefined;
      if (!value || !start || !TIME_PATTERN.test(value) || !TIME_PATTERN.test(start)) return true;
      return timeInMinutes(value) > timeInMinutes(start);
    }),
  ordem: yup.number().integer().min(0).required(),
  isNew: yup.boolean().required(),
});

export const createPolicySchema: yup.ObjectSchema<UnitPoliciesFormValues> = yup.object({
  tiposRefeicao: yup
    .array()
    .of(mealPolicySchema)
    .required()
    .test("unique-names", "Já existe um tipo de refeição com este nome", (meals) => {
      if (!meals) return true;
      const names = meals.map((meal) => normalizeMealTypeName(meal.nome));
      return names.every((name, index) => Boolean(name) && names.indexOf(name) === index);
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

export type CreatePolicySchemaFormData = UnitPoliciesFormValues;

export const createUnitSchema = yup.object({
  nome: yup.string().required("O nome da unidade é obrigatório"),
  endereco: yup.string().required("O endereço é obrigatório"),
  responsavelId: yup.string().required("Selecione o responsável"),
  ativo: yup.string().oneOf(["ativo", "inativo"]).required("Selecione o status"),
});

export type CreateUnitSchemaFormData = yup.InferType<typeof createUnitSchema>;
