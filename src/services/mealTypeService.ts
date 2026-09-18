import {
  TipoRefeicaoApi,
  TipoRefeicaoCreateApi,
  TipoRefeicaoPaginatedApi,
  TipoRefeicaoUpdateApi,
} from "@/Interfaces/Meals/MealTypes";
import { requestJson, unwrapResults } from "@/services/apiClient";
import {
  ApiRequestContext,
  getContextRequestHeaders,
} from "@/utils/authContextHeaders";

type MealTypeEntityResponse = TipoRefeicaoApi | { data: TipoRefeicaoApi };

function unwrapEntity(payload: MealTypeEntityResponse): TipoRefeicaoApi {
  return "data" in payload ? payload.data : payload;
}

export const mealTypeService = {
  listMealTypes: async (pageSize = 200, context?: ApiRequestContext | null) => {
    const payload = await requestJson<TipoRefeicaoPaginatedApi | TipoRefeicaoApi[]>(
      `/api/tipo-refeicao?page_size=${pageSize}`,
      { headers: getContextRequestHeaders(context) },
    );
    return unwrapResults(payload);
  },
  createMealType: async (
    data: TipoRefeicaoCreateApi,
    context?: ApiRequestContext | null,
  ) => {
    const payload = await requestJson<MealTypeEntityResponse>("/api/tipo-refeicao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getContextRequestHeaders(context),
      },
      body: JSON.stringify(data),
    });
    return unwrapEntity(payload);
  },
  updateMealType: async (
    id: number,
    data: TipoRefeicaoUpdateApi,
    context?: ApiRequestContext | null,
  ) => {
    const payload = await requestJson<MealTypeEntityResponse>(`/api/tipo-refeicao/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getContextRequestHeaders(context),
      },
      body: JSON.stringify(data),
    });
    return unwrapEntity(payload);
  },
};
