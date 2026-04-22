import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { normalizeUserData } from "@/utils/userUtils";
import { IUser } from "@/Interfaces/User/user";

/**
 * Fetches the user session directly on the server to avoid client-side flickering.
 */
export async function getServerUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mennu_token")?.value;
    const empresaId = cookieStore.get("empresa_id")?.value;

    if (!token) return null;

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/ativo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
        ...(empresaId ? { "Empresa-id-x": empresaId } : {}),
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
    console.error("Error fetching user on server:", error);
    return null;
  }
}
