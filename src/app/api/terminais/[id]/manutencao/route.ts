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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = getApiBaseUrl();
  const headers = await getHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const response = await fetch(`${baseUrl}/terminais/${id}/manutencao`, {
      method: "PATCH",
      headers,
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return NextResponse.json(
      { message: text || "Resposta sem conteúdo" },
      { status: response.status },
    );
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
