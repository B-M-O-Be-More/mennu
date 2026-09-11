import { IUserContext } from "@/Interfaces/User/context";
import { requestJson } from "@/services/apiClient";
import { normalizeUserContexts } from "@/utils/userContextUtils";

interface ContextsResponse {
  contextos?: unknown;
  data?: { contextos?: unknown };
}

export const authContextService = {
  listContexts: async (): Promise<IUserContext[]> => {
    const payload = await requestJson<ContextsResponse>("/api/auth/contextos", {
      cache: "no-store",
    });
    return normalizeUserContexts(payload.contextos ?? payload.data?.contextos);
  },
  getContextForUnit: async (unitId: number): Promise<IUserContext> => {
    const contexts = await authContextService.listContexts();
    const context = contexts.find((item) => item.unidade_id === unitId);

    if (!context) {
      throw new Error("Você não possui um contexto de acesso válido para esta unidade.");
    }

    return context;
  },
};
