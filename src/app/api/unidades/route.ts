import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

const baseUrl = getApiBaseUrl();

async function getHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;
  const empresaId = cookieStore.get("empresa_id")?.value;

  if (!token || !empresaId) return null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
    "Empresa-id-x": empresaId,
  };

  return headers;
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

export async function POST(req: NextRequest) {
  const headers = await getHeaders();
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const body = await req.json();
    const response = await fetch(`${baseUrl}/unidade/`, {
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

export async function GET(req: NextRequest) {
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const url = new URL(`${baseUrl}/unidade/`);
  if (search) url.searchParams.append("search", search);

  try {
    const response = await fetch(url.toString(), { headers });
    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
