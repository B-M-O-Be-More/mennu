import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

async function readProxyResponse(response: Response, fallbackMessage: string) {
  if (response.status === 204) {
    return { message: fallbackMessage };
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text.trim()) {
    return { message: fallbackMessage };
  }

  return { message: text };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Token de redefinição é obrigatório." },
      { status: 400 },
    );
  }

  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams({ token });
  const backendUrl = `${baseUrl}/auth/validar-token-redefinicao?${params.toString()}`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await readProxyResponse(
      response,
      "Resposta inválida ao validar o token.",
    );

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro ao validar token no backend:", error);
    return NextResponse.json(
      { message: "Erro interno ao validar o token." },
      { status: 500 },
    );
  }
}
