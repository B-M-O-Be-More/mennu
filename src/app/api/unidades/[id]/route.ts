import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

async function getContext(params: Promise<{ id: string }>) {
  const headers = await getAuthHeaders();
  const { id } = await params;
  return { headers, id };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}`, { headers }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}`, {
      method: "PUT", headers, body: await req.text(),
    }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}`, { method: "DELETE", headers }));
  } catch (err) {
    return proxyError(err);
  }
}
