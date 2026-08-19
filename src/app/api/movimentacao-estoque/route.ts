import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

async function getHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;
  const empresaId = cookieStore.get("empresa_id")?.value;

  if (!token || !empresaId) return null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
    "empresa-id-x": empresaId,
  };
}

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

export async function GET() {
  const baseUrl = getApiBaseUrl();
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/movimentacao-estoque/`, { headers });
    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const body = await req.json();

  try {
    const response = await fetch(`${baseUrl}/movimentacao-estoque/`, {
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
