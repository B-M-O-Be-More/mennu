import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { EMPRESA_COOKIE, TOKEN_COOKIE, UNIDADE_COOKIE } from "@/utils/authCookies";
import { normalizeUserData } from "@/utils/userUtils";
import { getNovuSubscriberId } from "@/utils/userUtils";

const NOVU_API_URL = process.env.NOVU_API_URL || "https://api.novu.co/v1";

/**
 * Resolve o usuário autenticado direto na API real (não confia no id que o
 * client mandar) pra evitar registrar o token de push de um usuário na
 * conta de outro.
 */
async function getAuthenticatedSubscriberId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return undefined;

  const baseUrl = getApiBaseUrl();
  const empresaId = cookieStore.get(EMPRESA_COOKIE)?.value;
  const unidadeId = cookieStore.get(UNIDADE_COOKIE)?.value;

  const response = await fetch(`${baseUrl}/auth/ativo`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      ...(empresaId ? { "empresa-id-x": empresaId } : {}),
      ...(unidadeId ? { "unidade-id-x": unidadeId } : {}),
    },
  });

  if (!response.ok) return undefined;

  const data = await response.json();
  return getNovuSubscriberId(normalizeUserData(data));
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.NOVU_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: "NOVU_SECRET_KEY não configurado" },
      { status: 500 },
    );
  }

  const subscriberId = await getAuthenticatedSubscriberId();
  if (!subscriberId) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { token } = await req.json();
  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { message: "Token de push inválido" },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${NOVU_API_URL}/subscribers/${encodeURIComponent(subscriberId)}/credentials`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${secretKey}`,
      },
      body: JSON.stringify({
        providerId: "fcm",
        credentials: { deviceTokens: [token] },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { message: `Falha ao registrar push no Novu: ${text.slice(0, 200)}` },
      { status: response.status },
    );
  }

  return NextResponse.json({ data: { ok: true }, message: null });
}
