import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { getWsBaseUrl } from "@/app/api/_shared/getWsBaseUrl";

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(`${baseUrl}/terminais/ws-ticket`, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      ticket: data.ticket,
      expires_in: data.expires_in,
      ws_url: `${getWsBaseUrl()}/ws/terminais/`,
    });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
