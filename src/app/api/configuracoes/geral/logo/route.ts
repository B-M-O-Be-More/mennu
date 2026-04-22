import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

const baseUrl = getApiBaseUrl();

async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;
  const empresaId = cookieStore.get("empresa_id")?.value;

  if (!token || !empresaId) return null;

  return {
    Authorization: token,
    "Empresa-id-x": empresaId,
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

export async function POST(req: NextRequest) {
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const formData = await req.formData();

  try {
    const response = await fetch(`${baseUrl}/configuracoes/geral/logo/`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/configuracoes/geral/logo/`, {
      method: "DELETE",
      headers,
    });

    if (response.ok) {
      return NextResponse.json({ message: "Logo removido com sucesso" });
    }

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
