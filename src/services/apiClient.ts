import { getApiMessage } from "@/utils/apiMessage";

interface NestedResults<T> {
  results?: T[];
}

interface ResultsPayload<T> extends NestedResults<T> {
  data?: NestedResults<T>;
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload: unknown = response.status === 204
    ? null
    : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getApiMessage(payload, "Não foi possível concluir a operação"));
  }

  return payload as T;
}

export function unwrapResults<T>(payload: T[] | ResultsPayload<T>): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  return [];
}
