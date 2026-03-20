import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrlRaw = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = baseUrlRaw
  ?.trim()
  .replace(/^['"]|['"]$/g, "")
  .replace(/\/+$/, "");

export async function POST() {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL não está configurado" },
      { status: 500 }
    );
  }


  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Token não encontrado" },
      { status: 401 }
    );
  }

  const logoutUrl = baseUrl.endsWith("/api")
    ? `${baseUrl}/auth/logout`
    : `${baseUrl}/api/auth/logout`;

  try {
    const response = await fetch(logoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token, 
      },
    });

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = { message: "Resposta sem JSON" };
    }

    const res = NextResponse.json(data, {
      status: response.status,
    });

    res.cookies.set("mennu_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Erro no logout:", error);

    return NextResponse.json(
      { message: "Erro ao conectar com o servidor de autenticação" },
      { status: 500 }
    );
  }
}