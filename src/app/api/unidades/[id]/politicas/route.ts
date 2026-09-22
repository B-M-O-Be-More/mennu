import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { readContextRequestHeaders } from "@/utils/authContextHeaders";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = readContextRequestHeaders(req.headers);
  if (context && context.unidade_id !== Number(id)) {
    return NextResponse.json({ message: "O contexto não corresponde à unidade informada" }, { status: 400 });
  }

  const headers = await getAuthHeaders(context);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}/politicas`, { headers }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = readContextRequestHeaders(req.headers);
  if (context && context.unidade_id !== Number(id)) {
    return NextResponse.json({ message: "O contexto não corresponde à unidade informada" }, { status: 400 });
  }

  const headers = await getAuthHeaders(context);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}/politicas`, {
      method: "PATCH", headers, body: await req.text(),
    }));
  } catch (err) {
    return proxyError(err);
  }
}
