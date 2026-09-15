import {
  GeneralSettingsApi,
  GeneralSettingsUpdateApi,
  PaginatedResponse,
  ResponsibleOption,
  SecuritySettingsApi,
  SecuritySettingsUpdateApi,
  StockSettingsApi,
  StockSettingsUpdateApi,
  UnitApi,
  UnitCreateApi,
  UnitListItem,
  UnitPolicyConfigApi,
  UnitUpdateApi,
} from "@/Interfaces/Settings/settings";
import { requestJson, unwrapResults } from "@/services/apiClient";
import {
  ApiRequestContext,
  getContextRequestHeaders,
} from "@/utils/authContextHeaders";

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

export const settingsService = {
  getGeneral: () => requestJson<GeneralSettingsApi>("/api/configuracoes/geral"),
  updateGeneral: (data: GeneralSettingsUpdateApi) =>
    requestJson<GeneralSettingsApi>("/api/configuracoes/geral", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  uploadLogo: (file: File) => {
    const data = new FormData();
    data.append("arquivo", file);
    return requestJson<GeneralSettingsApi>("/api/configuracoes/geral/logo", {
      method: "POST",
      body: data,
    });
  },
  getSecurity: () => requestJson<SecuritySettingsApi>("/api/configuracoes/seguranca"),
  updateSecurity: (data: SecuritySettingsUpdateApi) =>
    requestJson<SecuritySettingsApi>("/api/configuracoes/seguranca", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getStockSettings: () =>
    requestJson<StockSettingsApi>("/api/configuracoes/estoque"),
  updateStockSettings: (data: StockSettingsUpdateApi) =>
    requestJson<StockSettingsApi>("/api/configuracoes/estoque", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  listUnits: async () => {
    const payload = await requestJson<PaginatedResponse<UnitApi> | UnitApi[]>("/api/unidades?page_size=100");
    return unwrapResults(payload).map(mapUnitFromApi);
  },
  createUnit: (data: UnitCreateApi) =>
    requestJson<UnitApi>("/api/unidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  updateUnit: (id: number, data: UnitUpdateApi) =>
    requestJson<UnitApi>(`/api/unidades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteUnit: (id: number) => requestJson<void>(`/api/unidades/${id}`, { method: "DELETE" }),
  toggleUnitStatus: (id: number) =>
    requestJson<UnitApi>(`/api/unidades/${id}/toggle-status`, { method: "PATCH" }),
  getUnitPolicies: (id: number, context?: ApiRequestContext | null) =>
    requestJson<UnitPolicyConfigApi>(`/api/unidades/${id}/politicas`, {
      headers: getContextRequestHeaders(context),
    }),
  updateUnitPolicies: (
    id: number,
    data: UnitPolicyConfigApi,
    context?: ApiRequestContext | null,
  ) =>
    requestJson<UnitPolicyConfigApi>(`/api/unidades/${id}/politicas`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getContextRequestHeaders(context),
      },
      body: JSON.stringify(data),
    }),
  listResponsibleUsers: async () => {
    const payload = await requestJson<PaginatedResponse<ResponsibleOption> | ResponsibleOption[]>("/api/usuarios?page_size=100");
    return unwrapResults(payload)
      .filter((user) => Number.isInteger(user.id) && Boolean(user.nome))
      .map((user) => ({ id: user.id, nome: user.nome }));
  },
};
