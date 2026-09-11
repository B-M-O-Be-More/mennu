import {
  GeneralSettingsApi,
  GeneralSettingsUpdateApi,
  PaginatedResponse,
  ResponsibleOption,
  SecuritySettingsApi,
  SecuritySettingsUpdateApi,
  UnitApi,
  UnitCreateApi,
  UnitListItem,
  UnitPolicyConfigApi,
  UnitPoliciesFormValues,
  UnitUpdateApi,
} from "@/Interfaces/Settings/settings";
import { getApiMessage } from "@/utils/apiMessage";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getApiMessage(payload, "Não foi possível concluir a operação"));
  }

  return payload as T;
}

function unwrapResults<T>(payload: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.results ?? [];
}

/** A API pode devolver `/media/...`; no browser ela deve apontar ao host da API. */
export function resolveLogoUrl(url: string | null): string | null {
  if (!url || /^https?:\/\//i.test(url)) return url;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return url;

  return new URL(url, new URL(apiUrl).origin).toString();
}

export function mapUnitFromApi(unit: UnitApi): UnitListItem {
  return {
    id: unit.id,
    nome: unit.nome,
    endereco: unit.endereco ?? "-",
    responsavelId: unit.responsavel?.id ?? null,
    responsavelNome: unit.responsavel?.nome ?? "Não informado",
    ativo: unit.ativo,
    status: unit.ativo ? "ativo" : "inativo",
    politicas: unit.politicas ?? {},
    horarioAbertura: unit.horario_abertura,
    horarioFechamento: unit.horario_fechamento,
  };
}

const MEAL_FIELD_BY_TYPE = {
  cafe_manha: "cafeManha",
  almoco: "almoco",
  jantar: "jantar",
} as const;

function defaultMeal() {
  return { inicio: "", fim: "" };
}

export function toUnitPoliciesForm(config: UnitPolicyConfigApi): UnitPoliciesFormValues {
  const form: UnitPoliciesFormValues = {
    horarios: { cafeManha: defaultMeal(), almoco: defaultMeal(), jantar: defaultMeal() },
    limites: {
      diario: config.limite_diario_global ?? 0,
      semanal: config.limite_semanal_global ?? 0,
      mensal: config.limite_mensal_global ?? 0,
    },
  };
  config.politicas?.forEach((policy) => {
    const field = MEAL_FIELD_BY_TYPE[policy.tipo_refeicao as keyof typeof MEAL_FIELD_BY_TYPE];
    if (field) form.horarios[field] = { inicio: policy.horario_inicio, fim: policy.horario_fim };
  });
  return form;
}

export function mergeUnitPoliciesForm(
  current: UnitPolicyConfigApi,
  form: UnitPoliciesFormValues,
): UnitPolicyConfigApi {
  const editedTypes = new Set(Object.keys(MEAL_FIELD_BY_TYPE));
  const preservedPolicies = (current.politicas ?? []).filter(
    (policy) => !editedTypes.has(policy.tipo_refeicao),
  );
  const editedPolicies = Object.entries(MEAL_FIELD_BY_TYPE).map(([type, field]) => ({
    tipo_refeicao: type,
    horario_inicio: form.horarios[field].inicio,
    horario_fim: form.horarios[field].fim,
  }));

  return {
    ...current,
    politicas: [...preservedPolicies, ...editedPolicies],
    limite_diario_global: form.limites.diario,
    limite_semanal_global: form.limites.semanal,
    limite_mensal_global: form.limites.mensal,
  };
}

export const settingsService = {
  getGeneral: () => request<GeneralSettingsApi>("/api/configuracoes/geral"),
  updateGeneral: (data: GeneralSettingsUpdateApi) =>
    request<GeneralSettingsApi>("/api/configuracoes/geral", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  uploadLogo: (file: File) => {
    const data = new FormData();
    data.append("arquivo", file);
    return request<GeneralSettingsApi>("/api/configuracoes/geral/logo", {
      method: "POST",
      body: data,
    });
  },
  getSecurity: () => request<SecuritySettingsApi>("/api/configuracoes/seguranca"),
  updateSecurity: (data: SecuritySettingsUpdateApi) =>
    request<SecuritySettingsApi>("/api/configuracoes/seguranca", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  listUnits: async () => {
    const payload = await request<PaginatedResponse<UnitApi> | UnitApi[]>("/api/unidades?page_size=100");
    return unwrapResults(payload).map(mapUnitFromApi);
  },
  createUnit: (data: UnitCreateApi) =>
    request<UnitApi>("/api/unidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateUnit: (id: number, data: UnitUpdateApi) =>
    request<UnitApi>(`/api/unidades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteUnit: (id: number) => request<void>(`/api/unidades/${id}`, { method: "DELETE" }),
  toggleUnitStatus: (id: number) =>
    request<UnitApi>(`/api/unidades/${id}/toggle-status`, { method: "PATCH" }),
  getUnitPolicies: (id: number) => request<UnitPolicyConfigApi>(`/api/unidades/${id}/politicas`),
  updateUnitPolicies: (id: number, data: UnitPolicyConfigApi) =>
    request<UnitPolicyConfigApi>(`/api/unidades/${id}/politicas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  listResponsibleUsers: async () => {
    const payload = await request<PaginatedResponse<ResponsibleOption> | ResponsibleOption[]>("/api/usuarios?page_size=100");
    return unwrapResults(payload)
      .filter((user) => Number.isInteger(user.id) && Boolean(user.nome))
      .map((user) => ({ id: user.id, nome: user.nome }));
  },
};
