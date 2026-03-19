import { NextResponse } from "next/server";

const baseUrlRaw = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = baseUrlRaw?.trim().replace(/^['"]|['"]$/g, "").replace(/\/+$/, "");

export async function POST(req: Request) {
  if (!baseUrl) {
    return NextResponse.json({ message: "NEXT_PUBLIC_API_URL não está configurado" }, { status: 500 });
  }

  const cookies = req.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/(?:^|; )mennu_token=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  const logoutUrl = baseUrl.endsWith("/api") ? `${baseUrl}/auth/logout` : `${baseUrl}/api/auth/logout`;

  const response = await fetch(logoutUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}`, "X-API-Key": token } : {}),
    },
  });

  const data = await response.json();
  const res = NextResponse.json(data, { status: response.status });

  // Remove cookie localmente
  res.cookies.set("mennu_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
