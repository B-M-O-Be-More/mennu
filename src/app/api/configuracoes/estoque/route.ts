import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function GET() {
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    return proxyResponse(
      await fetch(`${getApiBaseUrl()}/configuracoes/estoque/`, { headers }),
    );
  } catch (error) {
    return proxyError(error);
  }
}

export async function PUT(request: NextRequest) {
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    return proxyResponse(
      await fetch(`${getApiBaseUrl()}/configuracoes/estoque/`, {
        method: "PUT",
        headers,
        body: await request.text(),
      }),
    );
  } catch (error) {
    return proxyError(error);
  }
}
