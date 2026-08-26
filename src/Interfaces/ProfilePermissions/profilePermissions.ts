import type { UserLevel } from "@/Interfaces/User/user";

export interface IProfilePermissionsItems {
  modulo: string;
  label?: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}

export interface IProfilePermissions {
  id: number;
  uuid: string;
  nome: string;
  descricao: string;
  is_global: boolean;
  is_default: boolean;
  total_usuarios: number;
  editavel: boolean;
  excluivel: boolean;
  permissoes_modulos: IProfilePermissionsItems[];
  criado_em: string;
}

export interface ICargosMetadados {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
  total_results: number;
}

export interface ICargosResponse {
  message: string;
  metadados?: ICargosMetadados;
  results?: IProfilePermissions[];
}

export interface ICargoUsuario {
  id: number;
  nome: string | null;
  email: string | null;
  documento: string;
  matricula: string | null;
  ativo: boolean;
  data_inicio: string;
}

export interface ICargoUsuariosResponse {
  message: string;
  metadados?: ICargosMetadados;
  results?: ICargoUsuario[];
}

/**
 * Código de permissão como a API devolve em `/auth/ativo` → `permissoes`:
 * `<recurso>.<ação>.<escopo>` (ex.: `cardapio.view.list`).
 *
 * Aceita curinga em qualquer segmento: `cardapio.*`, `relatorio.view.*`.
 */
export type PermissionCode = `${string}.${string}`;

/** Verbos de ação usados nos códigos de permissão. */
export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "assign"
  | "unassign"
  | "execute"
  | "submit"
  | "normalizar"
  | (string & Record<never, never>);

/**
 * Como tratar uma lista de permissões/flags.
 * `all` (padrão): faltando uma, o acesso é negado. `any`: basta uma.
 */
export type PermissionMatchMode = "all" | "any";

/**
 * Feature flag do usuário. A API devolve `feature_flags: []` hoje, então
 * aceitamos tanto a lista de nomes quanto objetos com nome + estado.
 */
export type FeatureFlag =
  | string
  | {
      nome?: string;
      name?: string;
      slug?: string;
      ativo?: boolean;
      active?: boolean;
      enabled?: boolean;
    };

/**
 * Critérios de acesso combináveis. Todos os critérios informados precisam
 * passar (AND entre critérios) e, dentro de uma lista, todas as permissões
 * são exigidas por padrão — use `mode="any"` para exigir apenas uma.
 */
export interface AccessCriteria {
  /**
   * Código(s) exigido(s): `"cardapio.edit.item"` ou
   * `["auditoriaestoque.create.item", "auditoriaestoque.delete.item"]`.
   * Faltando qualquer um deles, o acesso é negado.
   */
  permissions?: PermissionCode | PermissionCode[];
  /** Recurso/módulo: exige qualquer permissão dele (ex.: `"estoque"`). */
  module?: string;
  /** Restringe `module` a uma ação (ex.: `module="estoque" action="create"`). */
  action?: PermissionAction;
  /** Tipo de usuário exigido — comparação exata, sem bypass. */
  level?: UserLevel | UserLevel[];
  /** Feature flag exigida (mesma regra de lista das permissões). */
  feature?: string | string[];
  mode?: PermissionMatchMode;
}
