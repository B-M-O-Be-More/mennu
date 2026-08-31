import { PermissionCode } from "@/Interfaces/ProfilePermissions/profilePermissions";

/** Cargo do usuário dentro de um contexto (empresa + unidade). */
export interface IUserContextCargo {
  id: number;
  nome: string;
  /** Alcance do cargo na API: `unidade`, `empresa`, … */
  escopo: string;
}

/**
 * Um vínculo do usuário. A mesma empresa pode ter várias unidades e o
 * usuário pode ter login em mais de uma — cargo e permissões (`slugs`) são
 * por contexto, não existe mais uma lista global no raiz do usuário.
 */
export interface IUserContext {
  empresa_id: number;
  empresa_nome: string;
  unidade_id: number;
  unidade_nome: string;
  cargos: IUserContextCargo[];
  /** Códigos de permissão válidos **somente** dentro deste contexto. */
  slugs: PermissionCode[];
  acesso_total: boolean;
}
