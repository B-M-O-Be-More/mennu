import { IUser } from "@/Interfaces/User/user";
import {
  FeatureFlag,
  PermissionCode,
} from "@/Interfaces/ProfilePermissions/profilePermissions";
import { ADMIN_PERMISSIONS, hasPermission } from "@/utils/permissionUtils";
import { normalizeUserContexts } from "@/utils/userContextUtils";

function toNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Identificador estável do usuário para integrações externas (ex.: Novu). */
export function getNovuSubscriberId(user: IUser): string | undefined {
  if (Number.isFinite(user.id) && user.id > 0) {
    return String(user.id);
  }

  const email = user.email?.trim();
  if (email) return email;

  const matricula = user.matricula?.trim();
  if (matricula) return matricula;

  return undefined;
}

/**
 * Libera a seção administrativa da sidebar. Superusuário (`acesso_total`)
 * passa direto; os demais precisam de alguma permissão administrativa.
 */
export function hasAdminAccess(user: IUser): boolean {
  return hasPermission(user, ADMIN_PERMISSIONS, "any");
}

/**
 * Initial empty user state
 */
export function initialUser(): IUser {
  return {
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    matricula: "",
    tipo_usuario: "funcionario",
    numero_cartao: "",
    unidade: "",
    status: false,
    status_acesso: false,
    updated_at: "",
    token_access: {
      token: "",
      expirado_em: "",
    },
    ultima_refeicao: null,
    contextos: [],
    permissoes: [],
    acesso_total: false,
    feature_flags: [],
  };
}

/**
 * Normalizes user data from various API formats into the standard IUser interface.
 */
export function normalizeUserData(data: unknown): IUser {
  const parsed = (data ?? {}) as Partial<IUser> & {
    documento?: string;
    ativo?: boolean;
    atualizado_em?: string;
    tipo_usuario?: string;
  };

  const rawTipoUsuario = String(parsed.tipo_usuario ?? "funcionario").toLowerCase();
  
  // Normalization logic for role names
  let tipoUsuario: IUser["tipo_usuario"] = "funcionario";
  if (rawTipoUsuario === "admin" || rawTipoUsuario === "administrador") {
    tipoUsuario = "admin";
  } else if (rawTipoUsuario === "gestor") {
    tipoUsuario = "gestor";
  }

  const resolvedId =
    toNumber(parsed.id) ??
    toNumber((parsed as { usuario_id?: unknown }).usuario_id) ??
    0;

  return {
    ...initialUser(),
    ...parsed,
    id: resolvedId,
    cpf: parsed.cpf ?? parsed.documento ?? "",
    tipo_usuario: tipoUsuario,
    status: typeof parsed.status === "boolean" ? parsed.status : Boolean(parsed.ativo),
    status_acesso:
      typeof parsed.status_acesso === "boolean"
        ? parsed.status_acesso
        : Boolean(parsed.ativo),
    updated_at: parsed.updated_at ?? parsed.atualizado_em ?? "",
    token_access: {
      token: parsed.token_access?.token ?? "",
      expirado_em: parsed.token_access?.expirado_em ?? "",
    },
    ultima_refeicao: parsed.ultima_refeicao ?? null,
    // Um contexto por unidade em que o usuário tem vínculo. É de onde saem
    // as permissões depois que ele escolhe a unidade — ver
    // `applyContextToUser`.
    contextos: normalizeUserContexts(parsed.contextos),
    // Campo legado: a API antiga mandava os códigos planos
    // (`cardapio.view.list`) no raiz. Mantido para não quebrar payload
    // antigo; com `contextos` presente, quem vale é o contexto ativo.
    permissoes: Array.isArray(parsed.permissoes)
      ? parsed.permissoes.filter(
          (permissao): permissao is PermissionCode => typeof permissao === "string",
        )
      : [],
    acesso_total: Boolean(parsed.acesso_total),
    feature_flags: Array.isArray(parsed.feature_flags)
      ? (parsed.feature_flags as FeatureFlag[])
      : [],
  };
}
