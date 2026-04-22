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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await req.json();

  if (body.quantidade_atual === undefined || body.quantidade_atual === null) {
    return NextResponse.json(
      { message: "O campo 'quantidade_atual' é obrigatório." },
      { status: 400 },
    );
  }

  const payload = {
    ...body,
    quantidade_atual: body.quantidade_atual,
  };

  try {
    const response = await fetch(`${baseUrl}/insumo/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const response = await fetch(`${baseUrl}/insumo/${id}`, {
      method: "DELETE",
      headers,
    });

    if (response.ok) {
      return NextResponse.json({ message: "Insumo excluído com sucesso" });
    }

    const data = await safeJson(response);
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
