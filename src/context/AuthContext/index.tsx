"use client";

import React from "react";
// Native cookie deletion helper — no external dependency needed
const destroyCookie = (name: string, options?: { path?: string }) => {
  const path = options?.path ?? "/";
  document.cookie = `${name}=; Max-Age=0; path=${path}`;
};
import { UserContextProps, UserProviderProps } from "./interface";
import useFetch from "@/hooks/useFetch/hook";
import { LoginSchemaFormData } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { initialUser } from "@/data/initialUser";
import { IUser } from "@/Interfaces/User/user";

const UserContext = React.createContext<UserContextProps>({
  isAuthenticated: false,
  isLoadingLogin: true,
  isLoadingPages: true,
  isLoadingValidateToken: true,
  login: async () => ({}) as IUser,
  logout: async () => {},
  handleValidateToken: async () => {},
  user: {} as IUser,
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [requestLogin, isLoadingLogin] = useFetch<IUser>();
  const [requestValidateToken, isLoadingValidateToken] = useFetch<IUser>();
  const [requestLogout] = useFetch<unknown>();

  const [isLoadingPages, setLoadingPages] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<IUser>(initialUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const hasValidatedSessionRef = React.useRef(false);

  const router = useRouter();

  const normalizeUserData = React.useCallback((data: unknown): IUser => {
    const parsed = (data ?? {}) as Partial<IUser> & {
      documento?: string;
      ativo?: boolean;
      atualizado_em?: string;
      tipo_usuario?: string;
    };

    const rawTipoUsuario = String(parsed.tipo_usuario ?? "funcionario").toLowerCase();
    const tipoUsuario: IUser["tipo_usuario"] =
      rawTipoUsuario === "administrador" ||
      rawTipoUsuario === "gestor" ||
      rawTipoUsuario === "funcionario"
        ? rawTipoUsuario
        : "funcionario";

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
    };
  }, []);

  const handleUserState = React.useCallback(
    (data: unknown) => {
      setUser(normalizeUserData(data));
    },
    [normalizeUserData],
  );

  const login = async (formData: LoginSchemaFormData) => {
    const resp = await requestLogin("/api/auth/login", {
      method: "POST",
      body: formData,
    }).catch(() => {});

    type LoginResponse = { data?: IUser; message?: string };

    const respData = resp as LoginResponse | IUser | undefined;
    let userData: IUser | undefined;

    if (respData && "data" in respData && respData.data) {
      userData = respData.data;
    } else if (respData && !("data" in (respData as IUser))) {
      userData = respData as IUser;
    }

    if (userData) {
      handleUserState(userData);
      setIsAuthenticated(true);
      router.push("/dashboard");
    }

    return userData as IUser;
  };

  const clearSession = React.useCallback(() => {
    setUser(initialUser());

    destroyCookie("mennu_token", { path: "/" });
    destroyCookie("empresa_id", { path: "/" });

    setIsAuthenticated(false);
  }, []);

  const handleValidateToken = React.useCallback(async () => {
    const resp = await requestValidateToken(`/api/auth/ativo`, {
      method: "GET",
    })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setLoadingPages(false);
      });

    if (!resp) {
      return;
    }

    const responseData = resp as { data?: IUser } | IUser;
    const userData = "data" in responseData ? responseData.data : responseData;

    if (userData && typeof userData === "object") {
      setIsAuthenticated(true);
      handleUserState(userData);
    } else {
      clearSession();
    }
  }, [requestValidateToken, clearSession, handleUserState]);

  React.useEffect(() => {
    if (hasValidatedSessionRef.current) return;
    hasValidatedSessionRef.current = true;
    handleValidateToken();
  }, [handleValidateToken]);

  const logout = async () => {
    await requestLogout("/api/auth/logout", {
      method: "POST",
    }).catch(() => {});

    clearSession();
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{
        isLoadingPages,
        isAuthenticated,
        isLoadingLogin,
        isLoadingValidateToken,
        login,
        logout,
        user,
        handleValidateToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUser };