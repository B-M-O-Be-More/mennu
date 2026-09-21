import { headers } from "next/headers";

/**
 * Headers do request do navegador que precisam sobreviver ao salto pelo BFF.
 *
 * Nenhuma tela chama a API direto: o browser fala com um route handler e é o
 * handler que faz o `fetch`. Como esse `fetch` sai do Node, ele manda
 * `User-Agent: node` e a API enxerga como peer o servidor Next — então o log
 * de auditoria registrava a infraestrutura no lugar de quem agiu. É isto que
 * preenche `User Agent` e `Endereço IP` em `getLogAuditDetailFields`.
 *
 * A lista de repasse direto é fechada de propósito: header de request é dado
 * do cliente, e repassar em bloco deixaria o navegador injetar qualquer coisa
 * na chamada autenticada. O IP não entra nela — é derivado, não repassado.
 */
const FORWARDED_HEADERS = ["user-agent"] as const;

/**
 * Quantos proxies confiáveis ficam na frente do Next e ANEXAM na cadeia
 * `x-forwarded-for`. Hoje: um nginx no mesmo servidor, logo 1.
 *
 * Mudou a topologia — entrou CDN, Cloudflare, outro proxy — mude junto, senão
 * o IP registrado passa a ser o de um hop intermediário, sem erro visível.
 *
 * 0 desliga o repasse de IP, e é o único desligamento que existe. Não dá para
 * contar com a ausência do header como proteção: o próprio Next preenche
 * `x-forwarded-for` com o peer do socket quando o cliente não manda nenhum, e
 * repassa intocado o que o cliente mandar. Com o Next exposto direto, então,
 * quem escolhe o `ip_address` da auditoria é o navegador — nesse cenário o
 * valor correto aqui é 0.
 */
const TRUSTED_PROXY_HOPS = Number(process.env.TRUSTED_PROXY_HOPS ?? 1);

/**
 * Segredo compartilhado com a API, que prova que a chamada saiu daqui.
 *
 * A API não consegue nos identificar por IP quando rodamos na Vercel: o IP de
 * saída das functions é dinâmico, e fixá-lo exige o produto Static IPs. Sem
 * prova de origem, qualquer um mandaria `x-client-ip` para a API pública e
 * escolheria o que vai para a auditoria.
 *
 * Servidor-only: nunca prefixar com `NEXT_PUBLIC_`, que exporia o valor no
 * bundle do navegador.
 */
const BFF_SHARED_SECRET = process.env.BFF_SHARED_SECRET;

/**
 * IP do usuário, lido só de onde a nossa própria infra escreveu.
 *
 * ## Na Vercel
 *
 * `x-vercel-forwarded-for` é posto pela Vercel e sobrevive mesmo que algum
 * proxy acima sobrescreva o `x-forwarded-for`. Não é cadeia, é o IP público de
 * quem fez a requisição, e a Vercel documenta que descarta o que o cliente
 * mandar justamente para impedir spoofing.
 *
 * A checagem de `VERCEL` importa: fora da Vercel esse header não tem dono, e
 * um cliente poderia mandá-lo para ser lido aqui como se fosse confiável.
 *
 * ## Atrás de nginx
 *
 * `x-forwarded-for` é cadeia e cada proxy anexa o peer de quem recebeu. A
 * entrada mais à esquerda é a que o cliente mandou — é dele, e ele mente. Por
 * isso conta do fim para trás: com um nginx na frente, é a última.
 *
 * Cadeia mais curta que o número de hops significa que a topologia real não
 * corresponde à configurada. Devolve `null` em vez de chutar: sem IP o log
 * fica incompleto, com IP errado ele fica mentiroso.
 */
function resolveClientIp(incoming: Headers): string | null {
  if (process.env.VERCEL) {
    const daVercel = incoming.get("x-vercel-forwarded-for")?.trim();
    if (daVercel) return daVercel;
  }

  if (TRUSTED_PROXY_HOPS < 1) return null;

  const cadeia = (incoming.get("x-forwarded-for") ?? "")
    .split(",")
    .map((parte) => parte.trim())
    .filter(Boolean);

  if (cadeia.length < TRUSTED_PROXY_HOPS) return null;

  return cadeia[cadeia.length - TRUSTED_PROXY_HOPS] ?? null;
}

/**
 * Só funciona em contexto de request (route handler, server component,
 * server action) — é de lá que `headers()` lê. Retorna objeto vazio quando
 * nada confiável existe, para não sobrescrever com string vazia.
 *
 * O IP sai em `x-client-ip`, nome próprio, e não em `x-forwarded-for`. O nginx
 * da API anexa à cadeia (`$proxy_add_x_forwarded_for`), então um XFF mandado
 * daqui chegaria como `<usuário>, <servidor Next>` e a API leria a última
 * entrada — o servidor Next de novo. Subir a contagem de hops lá consertaria
 * este caminho e quebraria quem fala direto com a API, como os terminais: a
 * cadeia deles tem uma entrada só. Header dedicado atende aos dois.
 *
 * Do lado da API, `x-client-ip` só é honrado com prova de que a chamada saiu
 * daqui: o segredo em `x-internal-auth`, ou o IP de origem numa allowlist
 * quando o BFF tem IP fixo. Ver `client_ip` no `RequestLoggingMiddleware`.
 */
export async function getForwardedHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  const forwarded: Record<string, string> = {};

  for (const name of FORWARDED_HEADERS) {
    const value = incoming.get(name);
    if (value) forwarded[name] = value;
  }

  const clientIp = resolveClientIp(incoming);
  if (clientIp) {
    forwarded["x-client-ip"] = clientIp;
    // Sem o segredo o header viaja, mas a API o descarta — a não ser que este
    // servidor esteja na allowlist de IP dela. Mandar os dois juntos ou nada.
    if (BFF_SHARED_SECRET) forwarded["x-internal-auth"] = BFF_SHARED_SECRET;
  }

  return forwarded;
}
