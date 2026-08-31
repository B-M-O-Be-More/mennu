import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import {
  EMPRESA_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";

export async function POST(req: Request) {
  const baseUrl = getApiBaseUrl();
  const body = await req.json();

  // Sem barra no final: a API responde 404 em HTML para `/auth/login/`.
  // A convenção varia por endpoint (`/cargos/`, por exemplo, exige a barra).
  const authUrl = `${baseUrl}/auth/login`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  // Resposta fora do JSON (404/502 em HTML, por exemplo) viraria exceção no
  // parse e chegaria ao client como um 500 opaco — devolve o motivo.
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return NextResponse.json(
      {
        message: `Resposta inesperada do servidor de autenticação (${response.status}): ${text.slice(0, 200)}`,
      },
      { status: response.status === 200 ? 502 : response.status },
    );
  }

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const token = data?.token_access?.token;
  const empresaId = data?.empresa_id;

  const res = NextResponse.json(data, { status: response.status });

  if (token) {
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  if (empresaId) {
    res.cookies.set(EMPRESA_COOKIE, String(empresaId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  // A unidade é escolhida depois do login, em `/selecionar-unidade`. Limpar
  // aqui evita herdar a unidade da sessão anterior neste navegador.
  res.cookies.set(UNIDADE_COOKIE, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
