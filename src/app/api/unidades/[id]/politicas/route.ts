import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const headers = await getAuthHeaders();
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const { id } = await params;
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}/politicas`, { headers }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const headers = await getAuthHeaders();
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const { id } = await params;
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}/politicas`, {
      method: "PUT", headers, body: await req.text(),
    }));
  } catch (err) {
    return proxyError(err);
  }
}
