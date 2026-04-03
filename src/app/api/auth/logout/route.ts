import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";

const baseUrl = getApiBaseUrl();

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mennu_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Token não encontrado" },
      { status: 401 },
    );
  }

  const logoutUrl = `${baseUrl}/auth/logout`;

  try {
    const response = await fetch(logoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();

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

    res.cookies.set("empresa_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Erro ao conectar com o servidor de autenticação" },
      { status: 500 },
    );
  }
}
