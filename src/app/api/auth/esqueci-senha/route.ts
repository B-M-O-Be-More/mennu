import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

async function readProxyResponse(response: Response, fallbackMessage: string) {
  if (response.status === 204) {
    return { detail: fallbackMessage };
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text.trim()) {
    return { detail: fallbackMessage };
  }

  return { detail: text };
}

export async function POST(req: Request) {
  const body = await req.json();
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/auth/esqueci-senha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await readProxyResponse(
    response,
    "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.",
  );

  return NextResponse.json(data, { status: response.status });
}
