import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { UNIDADE_COOKIE } from "@/utils/authCookies";

async function getContext(params: Promise<{ id: string }>) {
  const headers = await getAuthHeaders();
  const { id } = await params;
  return { headers, id };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}`, { headers }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/unidade/${id}`, {
      method: "PUT", headers, body: await req.text(),
    }));
  } catch (err) {
    return proxyError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { headers, id } = await getContext(params);
  if (!headers) return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });

  try {
    const activeUnitId = (await cookies()).get(UNIDADE_COOKIE)?.value;
    const upstreamResponse = await fetch(`${getApiBaseUrl()}/unidade/${id}`, {
      method: "DELETE",
      headers,
    });
    const response = await proxyResponse(upstreamResponse);

    if (upstreamResponse.ok && Number(activeUnitId) === Number(id)) {
      response.cookies.set(UNIDADE_COOKIE, "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    return proxyError(err);
  }
}
