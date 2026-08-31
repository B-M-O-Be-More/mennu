import { IUser } from "@/Interfaces/User/user";
import { IUserContext } from "@/Interfaces/User/context";
import { LoginSchemaFormData } from "@/schemas/loginSchema";

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
  /** Fixa a unidade ativa da sessão e segue para o dashboard. */
  selectContext: (context: IUserContext) => Promise<void>;
  /** Descarta a unidade ativa e volta para a tela de seleção. */
  clearContext: () => Promise<void>;
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
