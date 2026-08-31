import { cookies } from "next/headers";
import {
  EMPRESA_COOKIE,
  TOKEN_COOKIE,
  UNIDADE_COOKIE,
} from "@/utils/authCookies";

/**
 * Headers de autenticação e escopo para chamar a API.
 *
 * `empresa-id-x` + `unidade-id-x` delimitam o tenant: a mesma empresa pode ter
 * várias unidades e o usuário pode ter vínculo em mais de uma, então toda
 * chamada precisa dizer em qual unidade ela acontece. A unidade ativa é
 * escolhida em `/selecionar-unidade` e persiste no cookie `unidade_id`.
 *
 * Retorna `null` quando falta token ou empresa — o handler responde 401.
 */
export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const empresaId = cookieStore.get(EMPRESA_COOKIE)?.value;
  const unidadeId = cookieStore.get(UNIDADE_COOKIE)?.value;

  if (!token || !empresaId) return null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
    "empresa-id-x": empresaId,
    // Ausente só entre o login e a escolha da unidade. O guard de rota
    // impede chegar às telas nesse intervalo, mas `/auth/ativo` precisa
    // responder mesmo assim — é dele que vem a lista de contextos.
    ...(unidadeId ? { "unidade-id-x": unidadeId } : {}),
  };
}
