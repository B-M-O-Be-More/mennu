import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL não está configurado" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;
  const empresaId = cookieStore.get("empresa_id")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const response = await fetch(`${baseUrl}/auth/ativo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      ...(empresaId ? { "empresa-id-x": empresaId } : {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: "Resposta inválida do servidor de autenticação" };

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const res = NextResponse.json(data, { status: response.status });

  const nextToken = data?.token_access?.token;
  const nextEmpresaId = data?.empresa_id;

  if (nextToken) {
    res.cookies.set("mennu_token", nextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  if (nextEmpresaId !== undefined && nextEmpresaId !== null) {
    res.cookies.set("empresa_id", String(nextEmpresaId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return res;
}
