import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getForwardedHeaders } from "@/utils/forwardedHeaders";

export async function POST(req: Request) {
  const body = await req.json();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/auth/redefinir-senha`, {
    method: "POST",
    headers: {
      ...(await getForwardedHeaders()),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data, { status: response.status });
}