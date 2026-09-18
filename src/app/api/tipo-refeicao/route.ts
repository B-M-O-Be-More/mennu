import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { readContextRequestHeaders } from "@/utils/authContextHeaders";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders(readContextRequestHeaders(req.headers));
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const url = new URL(`${baseUrl}/tipo-refeicao/`);

  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), { headers });
    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const context = readContextRequestHeaders(req.headers);
  const body: unknown = await req.json().catch(() => null);
  const unitId = Number((body as { unidade_id?: unknown } | null)?.unidade_id);
  if (context && context.unidade_id !== unitId) {
    return NextResponse.json({ message: "O contexto não corresponde à unidade informada" }, { status: 400 });
  }

  const headers = await getAuthHeaders(context);
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/tipo-refeicao/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}
