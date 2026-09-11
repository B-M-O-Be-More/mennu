import { cookies } from "next/headers";
import {
  EMPRESA_COOKIE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";
import { ApiRequestContext } from "@/utils/authContextHeaders";

/**
 * Headers de autenticação e escopo para chamar a API.
 *
 * `empresa-id-x` + `unidade-id-x` delimitam o tenant: a mesma empresa pode ter
 * várias unidades e o usuário pode ter vínculo em mais de uma, então toda
 * chamada precisa dizer em qual unidade ela acontece. A unidade ativa é
 * escolhida em `/selecionar-unidade` e persiste no cookie `unidade_id`.
 * Operações administrativas podem fornecer um contexto autorizado temporário,
 * sem substituir os cookies da sessão.
 *
 * Retorna `null` quando falta token ou empresa — o handler responde 401.
 */
export async function getAuthHeaders(
  context?: ApiRequestContext | null,
): Promise<Record<string, string> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const empresaId = context?.empresa_id ?? cookieStore.get(EMPRESA_COOKIE)?.value;
  const unidadeId = context?.unidade_id ?? cookieStore.get(UNIDADE_COOKIE)?.value;

  if (!token || !empresaId) return null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
    "empresa-id-x": String(empresaId),
    // Ausente só entre o login e a escolha da unidade. O guard de rota
    // impede chegar às telas nesse intervalo, mas `/auth/ativo` precisa
    // responder mesmo assim — é dele que vem a lista de contextos.
    ...(unidadeId ? { "unidade-id-x": String(unidadeId) } : {}),
  };
}
