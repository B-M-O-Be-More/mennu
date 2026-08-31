import { IUser, UserLevel } from "@/Interfaces/User/user";
import {
  AccessCriteria,
  PermissionAction,
  PermissionCode,
  PermissionMatchMode,
} from "@/Interfaces/ProfilePermissions/profilePermissions";

/**
 * Checagem de permissões do usuário na unidade ativa.
 *
 * As permissões vêm por contexto: `/auth/ativo` devolve um `contextos[]`
 * (um por unidade em que o usuário tem vínculo) e cada entrada traz a lista
 * plana de códigos `<recurso>.<ação>.<escopo>` (ex.: `cardapio.view.list`)
 * mais o flag `acesso_total`. `applyContextToUser` projeta o contexto
 * escolhido em `user.permissoes`/`user.acesso_total`, que é o que as
 * funções abaixo leem — trocar de unidade troca o resultado delas.
 *
 * Nada aqui substitui a validação do backend: serve para não exibir UI que
 * resultaria em 403.
 */

const WILDCARD = "*";

/** Permissões que liberam a área administrativa (sidebar `/admin`). */
export const ADMIN_PERMISSIONS: PermissionCode[] = [
  "cargo.view.list",
  "configuracao.view.geral",
  "configuracao.view.seguranca",
  "log.view.list",
];

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Códigos de permissão do usuário na unidade ativa, ignorando qualquer item
 * fora do formato. Sem unidade escolhida, vem vazio.
 */
export function getUserPermissions(user?: IUser | null): PermissionCode[] {
  const permissoes = user?.permissoes;
  if (!Array.isArray(permissoes)) return [];
  return permissoes.filter(
    (permissao): permissao is PermissionCode => typeof permissao === "string",
  );
}

/** Nomes das feature flags ativas do usuário. */
export function getUserFeatureFlags(user?: IUser | null): string[] {
  const flags = user?.feature_flags;
  if (!Array.isArray(flags)) return [];

  return flags.reduce<string[]>((acc, flag) => {
    if (typeof flag === "string") {
      acc.push(flag);
      return acc;
    }

    if (flag && typeof flag === "object") {
      const isActive = flag.ativo ?? flag.active ?? flag.enabled ?? true;
      const name = flag.nome ?? flag.name ?? flag.slug;
      if (isActive && name) acc.push(name);
    }

    return acc;
  }, []);
}

/**
 * Superusuário: único bypass das checagens de código de permissão. Vem do
 * `acesso_total` **do contexto ativo** — `tipo_usuario` não entra aqui,
 * então um admin com cargo restrito numa unidade só vê o que aquele cargo
 * permite, mesmo tendo acesso total em outra.
 */
export function hasFullAccess(user?: IUser | null): boolean {
  return user?.acesso_total === true;
}

/**
 * Compara dois códigos segmento a segmento, aceitando curinga em qualquer
 * lado. `cardapio.*` casa com `cardapio.view.list`; `estoque.view.*` casa com
 * `estoque.view.saldo`, mas não com `estoque.create.item`.
 */
export function matchesPermission(granted: string, required: string): boolean {
  if (granted === required) return true;

  const grantedSegments = granted.split(".");
  const requiredSegments = required.split(".");
  const length = Math.max(grantedSegments.length, requiredSegments.length);

  for (let index = 0; index < length; index += 1) {
    const grantedSegment = grantedSegments[index];
    const requiredSegment = requiredSegments[index];

    if (grantedSegment === WILDCARD || requiredSegment === WILDCARD) continue;

    // Um dos lados acabou: só casa se o lado curto terminar em curinga
    // (`cardapio.*` cobre tudo que vem depois).
    if (grantedSegment === undefined || requiredSegment === undefined) {
      const shorter =
        grantedSegment === undefined ? grantedSegments : requiredSegments;
      return shorter[shorter.length - 1] === WILDCARD;
    }

    if (grantedSegment !== requiredSegment) return false;
  }

  return true;
}

/**
 * Verifica código(s) de permissão. Sem nada exigido, libera; com lista,
 * `mode="all"` (padrão) exige todas — faltando uma, nega — e `mode="any"`
 * basta uma.
 */
export function hasPermission(
  user: IUser | null | undefined,
  permissions?: PermissionCode | PermissionCode[],
  mode: PermissionMatchMode = "all",
): boolean {
  const required = toArray(permissions);
  if (!required.length) return true;
  if (hasFullAccess(user)) return true;

  const granted = getUserPermissions(user);
  const check = (code: PermissionCode) =>
    granted.some((grantedCode) => matchesPermission(grantedCode, code));

  return mode === "any" ? required.some(check) : required.every(check);
}

/**
 * Verifica se o usuário tem alguma permissão no recurso/módulo — opcionalmente
 * restrita a uma ação. `hasModulePermission(user, "estoque", "create")` →
 * `estoque.create.*`.
 */
export function hasModulePermission(
  user: IUser | null | undefined,
  module: string,
  action?: PermissionAction,
): boolean {
  if (!module) return true;
  const pattern = (
    action ? `${module}.${action}.${WILDCARD}` : `${module}.${WILDCARD}`
  ) as PermissionCode;
  return hasPermission(user, pattern);
}

/**
 * Permissão de leitura de um recurso, no formato que a API usa:
 * `viewPermission("cardapio")` → `cardapio.view.*`, que casa com
 * `cardapio.view.list` e `cardapio.view.item`.
 *
 * O recurso é o nome que a API usa no código de permissão (singular:
 * `cardapio`, `relatorio`, `usuario`), não o rótulo da tela.
 */
export function viewPermission(resource: string): PermissionCode {
  return `${resource}.view.${WILDCARD}` as PermissionCode;
}

/** Comparação exata de `tipo_usuario` — sem bypass de superusuário. */
export function hasLevel(
  user: IUser | null | undefined,
  level?: UserLevel | UserLevel[],
): boolean {
  const levels = toArray(level);
  if (!levels.length) return true;

  const current = user?.tipo_usuario;
  if (!current) return false;

  return levels.includes(current);
}

/**
 * Feature flag ativa. Não sofre bypass de `acesso_total`: flag é
 * disponibilidade do recurso, não permissão de uso.
 */
export function hasFeature(
  user: IUser | null | undefined,
  feature?: string | string[],
  mode: PermissionMatchMode = "all",
): boolean {
  const required = toArray(feature);
  if (!required.length) return true;

  const active = getUserFeatureFlags(user);
  const check = (name: string) => active.includes(name);

  return mode === "any" ? required.some(check) : required.every(check);
}

/** Avalia todos os critérios informados (AND entre eles). */
export function checkAccess(
  user: IUser | null | undefined,
  criteria: AccessCriteria = {},
): boolean {
  const { permissions, module, action, level, feature, mode = "all" } = criteria;

  if (!hasLevel(user, level)) return false;
  if (!hasFeature(user, feature, mode)) return false;
  if (!hasPermission(user, permissions, mode)) return false;
  if (module && !hasModulePermission(user, module, action)) return false;

  return true;
}
