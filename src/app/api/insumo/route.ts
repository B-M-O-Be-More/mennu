import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { readContextRequestHeaders } from "@/utils/authContextHeaders";

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
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const url = new URL(`${baseUrl}/insumo/`);
  if (search) url.searchParams.append("search", search);

  // Usados para contar os itens que comporão o checklist da auditoria.
  const unidadeId = searchParams.get("unidade_id");
  const context = readContextRequestHeaders(req.headers);
  if (context && unidadeId && context.unidade_id !== Number(unidadeId)) {
    return NextResponse.json(
      { message: "O contexto não corresponde à unidade informada" },
      { status: 400 },
    );
  }

  const headers = await getAuthHeaders(context);
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const pageSize = searchParams.get("page_size");
  const critico = searchParams.get("critico");
  if (unidadeId) url.searchParams.append("unidade_id", unidadeId);
  if (pageSize) url.searchParams.append("page_size", pageSize);
  if (critico === "true" || critico === "false") {
    url.searchParams.append("critico", critico);
  }

  try {
    const response = await fetch(url.toString(), { headers });
    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const body = await req.json();

  try {
    const response = await fetch(`${baseUrl}/insumo/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
