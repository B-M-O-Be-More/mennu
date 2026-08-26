import { IUser, UserLevel } from "@/Interfaces/User/user";
import {
  AccessCriteria,
  PermissionAction,
  PermissionCode,
  PermissionMatchMode,
} from "@/Interfaces/ProfilePermissions/profilePermissions";

/**
 * Checagem de permissões a partir do payload de `/auth/ativo`.
 *
 * A API devolve uma lista plana de códigos `<recurso>.<ação>.<escopo>`
 * (ex.: `cardapio.view.list`) mais o flag `acesso_total` para quem não tem
 * restrição. Nada aqui substitui a validação do backend — serve para não
 * exibir UI que resultaria em 403.
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

/** Códigos de permissão do usuário, ignorando qualquer item fora do formato. */
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
 * Superusuário. `acesso_total` vem da API; `admin` entra aqui porque é o topo
 * da hierarquia neste sistema (o gate real continua no backend).
 */
export function hasFullAccess(user?: IUser | null): boolean {
  return user?.acesso_total === true || user?.tipo_usuario === "admin";
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
