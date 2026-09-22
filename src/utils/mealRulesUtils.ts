import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";
import { UnitPolicyConfigApi } from "@/Interfaces/Settings/settings";
import { MealRuleInput } from "@/schemas/mealRulesSchema";
import { apiTimeToInput } from "@/utils/timeRangeAdapter";

/** A API envia `tipo_refeicao` como slug (`almoco`); a UI mostra o nome legível. */
const MEAL_TYPE_LABELS: Record<string, string> = {
  cafe: "Café",
  cafe_da_manha: "Café da Manhã",
  almoco: "Almoço",
  lanche: "Lanche",
  lanche_da_tarde: "Lanche da Tarde",
  jantar: "Jantar",
  ceia: "Ceia",
};

export function mealTypeLabel(tipoRefeicao: string): string {
  const key = tipoRefeicao.trim().toLowerCase();
  if (MEAL_TYPE_LABELS[key]) return MEAL_TYPE_LABELS[key];

  return key
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Cada política vira um card. Limites ausentes na política caem no global da
 * unidade — `??` e não `||`, porque `0` significa "sem restrição".
 */
export function mapPoliciesToMealRules(
  config: UnitPolicyConfigApi,
  unitName: string,
): MealRuleResponse[] {
  return (config.politicas ?? []).map((policy) => ({
    id: policy.tipo_refeicao,
    unit: unitName,
    mealType: policy.tipo_refeicao,
    mealTypeLabel: mealTypeLabel(policy.tipo_refeicao),
    startTime: apiTimeToInput(policy.horario_inicio),
    endTime: apiTimeToInput(policy.horario_fim),
    dailyLimit: policy.limite_diario ?? config.limite_diario_global ?? 0,
    weeklyLimit: policy.limite_semanal ?? config.limite_semanal_global ?? 0,
    monthlyLimit: policy.limite_mensal ?? config.limite_mensal_global ?? 0,
    minInterval:
      policy.tempo_minimo_entre_refeicoes ?? config.intervalo_minimo ?? 0,
    isTimeRestricted: !(config.horario_flexivel ?? false),
  }));
}

/**
 * Monta o corpo do PATCH: os limites editados ficam na política do tipo de
 * refeição; `horario_flexivel` é da unidade inteira, por isso vai na raiz.
 */
export function applyMealRuleToPolicies(
  config: UnitPolicyConfigApi,
  tipoRefeicao: string,
  values: MealRuleInput,
): UnitPolicyConfigApi {
  const politicas = (config.politicas ?? []).map((policy) =>
    policy.tipo_refeicao === tipoRefeicao
      ? {
          ...policy,
          limite_diario: values.dailyLimit,
          limite_semanal: values.weeklyLimit,
          limite_mensal: values.monthlyLimit,
          tempo_minimo_entre_refeicoes: values.minInterval,
        }
      : policy,
  );

  return {
    ...config,
    politicas,
    horario_flexivel: !values.isTimeRestricted,
  };
}

export function formatMealSchedule(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "Horário não definido";
  return `${startTime} às ${endTime}`;
}
