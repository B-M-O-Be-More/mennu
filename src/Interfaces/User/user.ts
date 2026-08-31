import {
  FeatureFlag,
  PermissionCode,
} from "@/Interfaces/ProfilePermissions/profilePermissions";
import { IUserContext } from "@/Interfaces/User/context";

/** Nível do usuário, já normalizado para minúsculo (a API envia `ADMIN`). */
export type UserLevel = "admin" | "gestor" | "funcionario";

export interface IUser {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  documento?: string;
  matricula: string;
  telefone?: string | null;
  cargo?: string | null;
  tipo_usuario: UserLevel;
  categoria_usuario?: string;
  empresa_id?: number;
  status: boolean;
  status_acesso: boolean;
  numero_cartao: string;
  unidade: string;
  updated_at: string;
  token_access: {
    token: string;
    expirado_em: string;
  };
  ultima_refeicao: string | null;
  /**
   * Vínculos do usuário: uma entrada por unidade em que ele pode entrar.
   * Cada contexto traz o próprio cargo e as próprias permissões.
   */
  contextos?: IUserContext[];
  /**
   * Lista plana de códigos de permissão **do contexto ativo**
   * (ex.: `["cardapio.view.list", "estoque.create.item"]`), projetada por
   * `applyContextToUser`. Sem unidade escolhida, vem vazia.
   */
  permissoes?: PermissionCode[];
  /** Superusuário **na unidade ativa**: ignora a checagem de códigos. */
  acesso_total?: boolean;
  feature_flags?: FeatureFlag[];
}

export interface IUsuarioListItem {
  id: number;
  nome: string | null;
  documento: string;
  matricula: string | null;
  categoria_usuario: string;
  is_active: boolean;
  criado_em: string;
  unidade: { id: number; nome: string };
  numero_cartao: string | null;
}
