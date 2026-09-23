import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";

async function safeJson(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Resposta inesperada da API (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();

  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const unidadeId = searchParams.get("unidade_id");
  const url = new URL(`${baseUrl}/insumo/categorias`);

  if (unidadeId) {
    url.searchParams.set("unidade_id", unidadeId);
  }

  try {
    const response = await fetch(url.toString(), { headers });
    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
