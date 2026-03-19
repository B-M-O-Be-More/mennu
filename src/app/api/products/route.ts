import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  const cookiesState = await cookies();
  const token = cookiesState.get("mennu_token")?.value || cookiesState.get("token")?.value;

  const params = request.url.split("?")[1];
  const res = await fetch(
    `${baseUrl}/rota/example` + (params ? `?${params}` : ""),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        "X-API-Key": token || "",
      },
    },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
