import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function GET() {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/unidade/opcoes`, { headers });
    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}
