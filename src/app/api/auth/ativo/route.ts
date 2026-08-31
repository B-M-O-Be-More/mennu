import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import {
  EMPRESA_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";

export async function GET() {
  const baseUrl = getApiBaseUrl();
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const empresaId = cookieStore.get(EMPRESA_COOKIE)?.value;
  const unidadeId = cookieStore.get(UNIDADE_COOKIE)?.value;

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
      ...(unidadeId ? { "unidade-id-x": unidadeId } : {}),
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
    res.cookies.set(TOKEN_COOKIE, nextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  // O `empresa_id` do raiz é a empresa de origem do usuário; a unidade ativa
  // pode estar em outra. Com contexto já escolhido, não sobrescreve — quem
  // manda é a seleção feita em `/selecionar-unidade`.
  if (!unidadeId && nextEmpresaId !== undefined && nextEmpresaId !== null) {
    res.cookies.set(EMPRESA_COOKIE, String(nextEmpresaId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return res;
}
