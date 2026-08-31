import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { normalizeUserData } from "@/utils/userUtils";
import { IUser } from "@/Interfaces/User/user";
import {
  EMPRESA_COOKIE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";
import { parseUnidadeId } from "@/utils/userContextUtils";

/**
 * Fetches the user session directly on the server to avoid client-side flickering.
 */
export async function getServerUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;
    const empresaId = cookieStore.get(EMPRESA_COOKIE)?.value;
    const unidadeId = cookieStore.get(UNIDADE_COOKIE)?.value;

    if (!token) return null;

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/ativo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
        ...(empresaId ? { "empresa-id-x": empresaId } : {}),
        // Ausente entre o login e a escolha da unidade — `/auth/ativo` é
        // justamente quem devolve os `contextos` disponíveis.
        ...(unidadeId ? { "unidade-id-x": unidadeId } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    const userData = data?.data || data;

    if (userData && typeof userData === "object") {
        const normalized = normalizeUserData(userData);
        // Strict check: if marked as inactive, don't return user
        if (!normalized.status || !normalized.status_acesso) return null;
        return normalized;
    }

    return null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching user on server:", error);
    return null;
  }
}

/**
 * Unidade ativa gravada no cookie, lida no servidor. Passar esse valor para
 * o `UserProvider` evita divergência de hidratação — o client leria o mesmo
 * cookie, mas só depois do HTML do servidor já ter sido montado sem ele.
 */
export async function getServerActiveUnidadeId(): Promise<number | null> {
  const cookieStore = await cookies();
  return parseUnidadeId(cookieStore.get(UNIDADE_COOKIE)?.value);
}
