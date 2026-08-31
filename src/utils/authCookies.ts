/**
 * Nomes dos cookies de sessão. Ficam num único lugar porque são lidos dos
 * dois lados: os route handlers montam os headers da API a partir deles e o
 * client precisa saber qual unidade está ativa para renderizar a sidebar e
 * decidir o redirect para `/selecionar-unidade`.
 */

/** JWT da API. Sempre `httpOnly` — o client nunca lê. */
export const TOKEN_COOKIE = "mennu_token";

/** Escopo de empresa (`empresa-id-x`). `httpOnly`. */
export const EMPRESA_COOKIE = "empresa_id";

/**
 * Escopo de unidade (`unidade-id-x`). Legível pelo client de propósito: não é
 * credencial (o JWT continua `httpOnly`) e a UI precisa do valor para saber
 * se já existe unidade escolhida. Quem valida o vínculo é o backend.
 */
export const UNIDADE_COOKIE = "unidade_id";

/** Dados não sensíveis do usuário, para hidratar a UI sem piscar. */
export const USER_DATA_COOKIE = "mennu_user_data";

/** Uma semana, igual ao `maxAge` do token. */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
