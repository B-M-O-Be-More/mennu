import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  
  if (!token) {
    return NextResponse.json(
      { message: "Token de redefinição é obrigatório." },
      { status: 400 }
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

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro ao validar token no backend:", error);
    return NextResponse.json(
      { message: "Erro interno ao validar o token." },
      { status: 500 }
    );
  }
}