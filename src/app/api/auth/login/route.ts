import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL não está configurado" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const authUrl = `${baseUrl}/auth/login`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const token = data?.token_access?.token;
  const empresaId = data?.empresa_id; 

  const res = NextResponse.json(data, { status: response.status });

  if (token) {
    res.cookies.set("mennu_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  if (empresaId) {
    res.cookies.set("empresa_id", String(empresaId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return res;
}