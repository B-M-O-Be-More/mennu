import { useUser } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch/hook";
import { Options } from "@/hooks/useFetch/interface";

/**
 * Wrapper sobre useFetch que injeta automaticamente os headers
 * Authorization e Empresa-id-x do usuário autenticado.
 *
 * Use este hook em todos os endpoints protegidos.
 * O useFetch original permanece sem dependência de contexto para
 * uso dentro do próprio AuthContext (login, logout, validateToken).
 */
export default function useAuthFetch<T>() {
  const { user } = useUser();
  const [request, isLoading, data] = useFetch<T>();

  const authRequest = (url: string, options: Options) =>
    request(url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(user.token_access?.token
          ? { Authorization: user.token_access.token }
          : {}),
        ...(user.empresa_id != null
          ? { "Empresa-id-x": String(user.empresa_id) }
          : {}),
      },
    });

  return [authRequest, isLoading, data] as const;
}
