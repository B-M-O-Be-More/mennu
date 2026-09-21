import { headers } from "next/headers";

/**
 * Headers do request do navegador que precisam sobreviver ao salto pelo BFF.
 *
 * Nenhuma tela chama a API direto: o browser fala com um route handler e é o
 * handler que faz o `fetch`. Como esse `fetch` sai do Node, ele manda
 * `User-Agent: node` — então o log de auditoria da API registrava o servidor
 * Next no lugar do navegador de quem agiu. Repassar o header é o que preenche
 * `User Agent` em `getLogAuditDetailFields`.
 *
 * A lista é fechada de propósito: header de request é dado do cliente, e
 * repassar em bloco deixaria o navegador injetar qualquer coisa na chamada
 * autenticada.
 *
 * `x-forwarded-for` e `x-real-ip` ficam fora deliberadamente. O BFF não tem
 * acesso ao IP do peer (`NextRequest.ip` saiu no Next 15 e route handler
 * recebe um `Request` da Web API), então não conseguiria anexar seu hop à
 * cadeia como um reverse proxy faria — repassaria o valor cru vindo do
 * cliente. Sem proxy confiável na frente do Next isso deixaria o navegador
 * escolher o `ip_address` gravado na auditoria. Resolver o IP exige saber
 * quantos hops confiáveis existem na topologia de deploy; enquanto isso não
 * estiver definido, `Endereço IP` fica com o que a API vê do socket.
 */
const FORWARDED_HEADERS = ["user-agent"] as const;

/**
 * Só funciona em contexto de request (route handler, server component,
 * server action) — é de lá que `headers()` lê. Retorna objeto vazio quando o
 * header não veio, para não sobrescrever com string vazia.
 */
export async function getForwardedHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  const forwarded: Record<string, string> = {};

  for (const name of FORWARDED_HEADERS) {
    const value = incoming.get(name);
    if (value) forwarded[name] = value;
  }

  return forwarded;
}
