import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function POST(req: NextRequest) {
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const headers = new Headers(authHeaders);
    // O boundary do multipart é montado pelo fetch; não pode ser fixado como JSON.
    headers.delete("Content-Type");
    return proxyResponse(await fetch(`${getApiBaseUrl()}/configuracoes/geral/logo/`, {
      method: "POST", headers, body: await req.formData(),
    }));
  } catch (err) {
    return proxyError(err);
  }
}
