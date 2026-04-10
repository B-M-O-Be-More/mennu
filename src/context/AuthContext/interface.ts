
import { IUser } from "@/Interfaces/User/user";
import { LoginSchemaFormData } from "@/schemas/loginSchema";

export interface UserContextProps {
  login: (params: LoginSchemaFormData) => Promise<IUser>;
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
  initialUser?: IUser | null;
}

export interface LoginAuthenticated {
  token: string;
  user: IUser;
}
