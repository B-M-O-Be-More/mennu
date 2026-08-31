import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  EMPRESA_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";

/**
 * Contexto ativo da sessão: em qual empresa/unidade as requisições seguintes
 * acontecem. O client escolhe em `/selecionar-unidade` a partir dos
 * `contextos` que vieram de `/auth/ativo`; aqui só persistimos a escolha nos
 * cookies que `getAuthHeaders` transforma em `empresa-id-x` e `unidade-id-x`.
 *
 * Não validamos o vínculo aqui de propósito: quem autoriza o acesso à
 * unidade é o backend, a cada chamada. Este handler é só transporte.
 */

function isValidId(value: unknown): value is number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

/** Define a unidade (e a empresa) ativa. */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const empresaId = (body as { empresa_id?: unknown } | null)?.empresa_id;
  const unidadeId = (body as { unidade_id?: unknown } | null)?.unidade_id;

  if (!isValidId(empresaId) || !isValidId(unidadeId)) {
    return NextResponse.json(
      { message: "Informe `empresa_id` e `unidade_id` válidos" },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ message: "Contexto selecionado" });

  res.cookies.set(EMPRESA_COOKIE, String(empresaId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  });

  // Sem `httpOnly`: a UI lê este cookie para saber se já existe unidade
  // escolhida (sidebar e guard de rota). Não é credencial.
  res.cookies.set(UNIDADE_COOKIE, String(unidadeId), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}

/** Limpa a unidade ativa — usado pelo "Trocar unidade" da sidebar. */
export async function DELETE() {
  const res = NextResponse.json({ message: "Contexto limpo" });

  res.cookies.set(UNIDADE_COOKIE, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
