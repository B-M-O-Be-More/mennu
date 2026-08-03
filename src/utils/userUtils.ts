import { IUser } from "@/Interfaces/User/user";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";

const ADMIN_MODULES = ["Configurações", "Permissões", "Perfil de Acesso"];

/**
 * Returns true if the user has access to the admin section.
 * Checks tipo_usuario first, then falls back to module-level permissions.
 */
export function hasAdminAccess(user: IUser): boolean {
  if (user.tipo_usuario === "admin") return true;
  if (!user.permissoes?.length) return false;
  return user.permissoes.some(
    (p) => ADMIN_MODULES.includes(p.modulo) && p.visualizar
  );
}

type PermissionAction = "visualizar" | "criar" | "editar" | "excluir";

/**
 * Returns true if the user has the given action permission on the given
 * module. Admins bypass module-level checks — the real enforcement always
 * happens server-side (CargoPermission); this only avoids showing UI that
 * would just 403.
 */
export function hasModulePermission(
  user: IUser,
  modulo: string,
  action: PermissionAction = "visualizar"
): boolean {
  if (user.tipo_usuario === "admin") return true;
  if (!user.permissoes?.length) return false;
  return user.permissoes.some((p) => p.modulo === modulo && p[action]);
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
    permissoes: [],
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

  return {
    ...initialUser(),
    ...parsed,
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
    permissoes: Array.isArray(parsed.permissoes)
      ? (parsed.permissoes as IProfilePermissionsItems[])
      : [],
  };
}
