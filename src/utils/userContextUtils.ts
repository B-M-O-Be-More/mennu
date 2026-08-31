import { IUser } from "@/Interfaces/User/user";
import { IUserContext, IUserContextCargo } from "@/Interfaces/User/context";
import { PermissionCode } from "@/Interfaces/ProfilePermissions/profilePermissions";

/**
 * Contextos de acesso do usuário — um por unidade em que ele tem vínculo.
 *
 * A API deixou de mandar uma lista global de permissões: cada contexto traz
 * os próprios `slugs` e o próprio `acesso_total`. Quem manda no que a UI
 * libera é sempre o contexto ativo, escolhido em `/selecionar-unidade`.
 */

/** Tela onde o usuário escolhe a unidade em que vai trabalhar. */
export const SELECT_UNIT_ROUTE = "/selecionar-unidade";

function toNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCargos(value: unknown): IUserContextCargo[] {
  if (!Array.isArray(value)) return [];

  return value.reduce<IUserContextCargo[]>((acc, item) => {
    if (!item || typeof item !== "object") return acc;
    const cargo = item as Partial<IUserContextCargo>;
    const id = toNumber(cargo.id);
    if (id === null) return acc;

    acc.push({
      id,
      nome: String(cargo.nome ?? ""),
      escopo: String(cargo.escopo ?? ""),
    });
    return acc;
  }, []);
}

/**
 * Descarta contextos sem `unidade_id` — sem ele não há como carimbar o
 * header `unidade-id-x`, então o contexto seria inútil na tela de seleção.
 */
export function normalizeUserContexts(value: unknown): IUserContext[] {
  if (!Array.isArray(value)) return [];

  return value.reduce<IUserContext[]>((acc, item) => {
    if (!item || typeof item !== "object") return acc;
    const contexto = item as Record<string, unknown>;

    const unidadeId = toNumber(contexto.unidade_id);
    const empresaId = toNumber(contexto.empresa_id);
    if (unidadeId === null || empresaId === null) return acc;

    acc.push({
      empresa_id: empresaId,
      empresa_nome: String(contexto.empresa_nome ?? ""),
      unidade_id: unidadeId,
      unidade_nome: String(contexto.unidade_nome ?? ""),
      cargos: normalizeCargos(contexto.cargos),
      slugs: Array.isArray(contexto.slugs)
        ? contexto.slugs.filter(
            (slug): slug is PermissionCode => typeof slug === "string",
          )
        : [],
      acesso_total: contexto.acesso_total === true,
    });
    return acc;
  }, []);
}

/** Contextos do usuário, já normalizados. */
export function getUserContexts(user?: IUser | null): IUserContext[] {
  return Array.isArray(user?.contextos) ? user.contextos : [];
}

/** Contexto correspondente à unidade informada, se o usuário tiver vínculo. */
export function findUserContext(
  user: IUser | null | undefined,
  unidadeId?: number | null,
): IUserContext | null {
  if (unidadeId === null || unidadeId === undefined) return null;
  return (
    getUserContexts(user).find(
      (contexto) => contexto.unidade_id === unidadeId,
    ) ?? null
  );
}

/** Rótulo do cargo no contexto — vários cargos viram "A, B". */
export function getContextRoleLabel(contexto: IUserContext): string {
  return contexto.cargos
    .map((cargo) => cargo.nome)
    .filter(Boolean)
    .join(", ");
}

/**
 * Projeta o contexto ativo sobre o usuário: `permissoes` e `acesso_total`
 * passam a refletir a unidade escolhida, e não mais o raiz do payload. É o
 * que mantém `<Can />`/`usePermissions` funcionando sem mudança nas telas.
 *
 * Sem contexto ativo o usuário fica sem permissão alguma — inclusive quem
 * tem `acesso_total` no raiz. Fora de uma unidade não há o que autorizar, e
 * negar aqui evita a UI liberar tela entre o login e a escolha da unidade.
 *
 * Payload legado (sem `contextos`) segue usando o que veio no raiz.
 */
export function applyContextToUser(
  user: IUser,
  contexto: IUserContext | null,
): IUser {
  if (contexto) {
    return {
      ...user,
      empresa_id: contexto.empresa_id,
      unidade: contexto.unidade_nome,
      cargo: getContextRoleLabel(contexto) || user.cargo,
      permissoes: contexto.slugs,
      acesso_total: contexto.acesso_total,
    };
  }

  if (!getUserContexts(user).length) return user;

  return { ...user, permissoes: [], acesso_total: false };
}

/** Lê o `unidade_id` persistido (cookie ou prop do servidor). */
export function parseUnidadeId(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
