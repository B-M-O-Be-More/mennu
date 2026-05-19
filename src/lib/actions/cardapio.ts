import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { Cardapio, PaginatedResponse } from "@/types/cardapio";

export async function getCardapios(filters: Record<string, string> = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;
  const empresaId = cookieStore.get("empresa_id")?.value;

  if (!token || !empresaId) {
    throw new Error("Token ou Empresa ID não encontrado nos cookies.");
  }

  const baseUrl = getApiBaseUrl();
  const url = new URL(`${baseUrl}/cardapio/`);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "empresa-id-x": empresaId,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Erro ao buscar cardápios: ${response.status} ${errorText}`,
    );
  }

  return response.json() as Promise<PaginatedResponse<Cardapio>>;
}
