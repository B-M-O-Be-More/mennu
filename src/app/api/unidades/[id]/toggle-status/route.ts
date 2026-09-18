import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const headers = await getAuthHeaders();
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const { id } = await params;
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}/toggle-status`, {
      method: "PATCH", headers,
    }));
  } catch (err) {
    return proxyError(err);
  }
}
