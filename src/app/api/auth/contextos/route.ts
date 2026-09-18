import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { proxyError, proxyResponse } from "@/app/api/_shared/proxyResponse";
import { TOKEN_COOKIE } from "@/utils/authCookies";

export async function GET() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });
  }

  try {
    return proxyResponse(await fetch(`${getApiBaseUrl()}/auth/contextos`, {
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
      cache: "no-store",
    }));
  } catch (error) {
    return proxyError(error);
  }
}
