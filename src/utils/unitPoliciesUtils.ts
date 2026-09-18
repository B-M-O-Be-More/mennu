import { TipoRefeicaoApi } from "@/Interfaces/Meals/MealTypes";
import {
  MealPolicyApi,
  UnitPolicyConfigApi,
  UnitPoliciesFormValues,
} from "@/Interfaces/Settings/settings";
import { apiTimeToInput, inputTimeToApi } from "@/utils/timeRangeAdapter";

export function normalizeMealTypeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function toPolicyTypeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function toUnitPoliciesForm(
  config: UnitPolicyConfigApi,
  mealTypes: TipoRefeicaoApi[],
): UnitPoliciesFormValues {
  return {
    tiposRefeicao: [...mealTypes]
      .sort((left, right) => left.ordem - right.ordem)
      .map((mealType) => ({
        tipoRefeicaoId: mealType.id,
        nome: mealType.nome,
        horarioInicio: apiTimeToInput(mealType.horario_inicio),
        horarioFim: apiTimeToInput(mealType.horario_fim),
        ordem: mealType.ordem,
        isNew: false,
      })),
    limites: {
      diario: config.limite_diario_global ?? 0,
      semanal: config.limite_semanal_global ?? 0,
      mensal: config.limite_mensal_global ?? 0,
    },
  };
}

function basePolicy(meal: UnitPoliciesFormValues["tiposRefeicao"][number]): MealPolicyApi {
  return {
    tipo_refeicao: toPolicyTypeName(meal.nome),
    horario_inicio: inputTimeToApi(meal.horarioInicio),
    horario_fim: inputTimeToApi(meal.horarioFim),
    limite_diario: 0,
    limite_semanal: 0,
    limite_mensal: 0,
  };
}

export function mergeDynamicUnitPolicies(
  current: UnitPolicyConfigApi,
  form: UnitPoliciesFormValues,
): UnitPolicyConfigApi {
  const mealsByName = new Map(
    form.tiposRefeicao.map((meal) => [normalizeMealTypeName(meal.nome), meal]),
  );
  const representedNames = new Set<string>();

  const existingPolicies = (current.politicas ?? []).map((policy) => {
    const normalizedName = normalizeMealTypeName(policy.tipo_refeicao);
    const meal = mealsByName.get(normalizedName);
    if (!meal) return policy;

    representedNames.add(normalizedName);
    return {
      ...policy,
      horario_inicio: inputTimeToApi(meal.horarioInicio),
      horario_fim: inputTimeToApi(meal.horarioFim),
    };
  });

  const missingPolicies = form.tiposRefeicao
    .filter((meal) => !representedNames.has(normalizeMealTypeName(meal.nome)))
    .map(basePolicy);

  return {
    ...current,
    politicas: [...existingPolicies, ...missingPolicies],
    limite_diario_global: form.limites.diario,
    limite_semanal_global: form.limites.semanal,
    limite_mensal_global: form.limites.mensal,
  };
}

export function getMealTimeSnapshot(mealTypes: TipoRefeicaoApi[]) {
  return new Map(
    mealTypes.map((mealType) => [
      mealType.id,
      {
        horarioInicio: apiTimeToInput(mealType.horario_inicio),
        horarioFim: apiTimeToInput(mealType.horario_fim),
      },
    ]),
  );
}
