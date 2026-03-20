"use client";

import React from "react";
import { destroyCookie } from "nookies";
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

  const [isLoadingPages, setLoadingPages] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<IUser>(initialUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  const router = useRouter();

  const handleUserState = (data: IUser) => {
    setUser(data);
  };

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

    // ✅ remove apenas o cookie correto
    destroyCookie(undefined, "mennu_token", { path: "/" });

    setIsAuthenticated(false);
  }, []);

  const handleValidateToken = React.useCallback(async () => {
    const resp = await requestValidateToken(`/api/auth/active`, {
      method: "GET",
    })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setLoadingPages(false);
      });

    if (resp && resp.message === "Token ativo") {
      setIsAuthenticated(true);
      setUser({ ...resp.data });
    }
  }, [requestValidateToken, clearSession]);

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