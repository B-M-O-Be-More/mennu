
import { IUser } from "@/Interfaces/User/user";
import { LoginSchemaType } from "@/schemas/loginSchema";

export interface UserContextProps {
  login: (params: LoginSchemaType) => Promise<IUser>;
  logout: () => Promise<void>;
  handleValidateToken: () => Promise<void>;
  isLoadingLogin: boolean;
  isAuthenticated: boolean;
  isLoadingPages: boolean;
  isLoadingValidateToken: boolean;
  user: IUser;
}

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface LoginAuthenticated {
  token: string;
  user: IUser;
}
