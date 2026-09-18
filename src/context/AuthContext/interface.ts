import { IUser } from "@/Interfaces/User/user";
import { IUserContext } from "@/Interfaces/User/context";
import { LoginSchemaFormData } from "@/schemas/loginSchema";

export interface ClearContextOptions {
  /** Unidade definitivamente removida e que não pode voltar à seleção. */
  removedUnitId?: number;
}

export interface UserContextProps {
  login: (params: LoginSchemaFormData) => Promise<IUser | null>;
  logout: () => Promise<void>;
  handleValidateToken: () => Promise<void>;
  isLoadingLogin: boolean;
  isAuthenticated: boolean;
  isLoadingPages: boolean;
  isLoadingValidateToken: boolean;
  /**
   * Usuário com o contexto ativo já aplicado: `permissoes` e `acesso_total`
   * são os da unidade escolhida. Sem unidade ativa, vem sem permissão.
   */
  user: IUser;
  /** Unidades em que o usuário tem vínculo. */
  contexts: IUserContext[];
  /** Unidade ativa — `null` até o usuário escolher em `/selecionar-unidade`. */
  activeContext: IUserContext | null;
  /** Seleção/troca de unidade em andamento. */
  isLoadingContext: boolean;
  /** Atualização da lista de unidades acessíveis em andamento. */
  isRefreshingContexts: boolean;
  /** Fixa a unidade ativa da sessão e segue para o dashboard. */
  selectContext: (context: IUserContext) => Promise<void>;
  /** Reconsulta as unidades acessíveis sem exigir um novo login. */
  refreshContexts: () => Promise<void>;
  /** Descarta a unidade ativa e volta para a tela de seleção. */
  clearContext: (options?: ClearContextOptions) => Promise<void>;
}

export interface UserProviderProps {
  children: React.ReactNode;
  initialUser?: IUser | null;
  /**
   * Unidade ativa lida do cookie no servidor. Evita divergência de
   * hidratação entre o HTML do servidor e o primeiro render do client.
   */
  initialUnidadeId?: number | null;
}

export interface LoginAuthenticated {
  token: string;
  user: IUser;
}
