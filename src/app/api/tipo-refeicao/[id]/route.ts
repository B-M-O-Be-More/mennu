import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { readContextRequestHeaders } from "@/utils/authContextHeaders";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders(readContextRequestHeaders(req.headers));
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const response = await fetch(`${baseUrl}/tipo-refeicao/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders(readContextRequestHeaders(req.headers));
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const response = await fetch(`${baseUrl}/tipo-refeicao/${id}`, {
      method: "DELETE",
      headers,
    });

    if (response.ok) {
      return NextResponse.json({ message: "Tipo de refeição excluído com sucesso" });
    }

    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}
