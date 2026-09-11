import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const url = new URL(`${baseUrl}/unidade/`);
  searchParams.forEach((value, key) => {
    if (value) url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), { headers });
    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });
  }

  try {
    const response = await fetch(`${baseUrl}/unidade/`, {
      method: "POST",
      headers,
      body: await req.text(),
    });
    return proxyResponse(response);
  } catch (err) {
    return proxyError(err);
  }
}
