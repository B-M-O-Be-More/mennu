"use client";

import React from "react";
import { destroyCookie, setCookie } from "nookies";
import { UserContextProps, UserProviderProps } from "./interface";
import useFetch from "@/hooks/useFetch/hook";
import { LoginSchemaType } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { initialUser } from "@/data/initialUser";
import { User } from "@/Interfaces/User/user";

const UserContext = React.createContext<UserContextProps>({
  isAuthenticated: false,
  isLoadingLogin: true,
  isLoadingPages: true,
  isLoadingValidateToken: true,
  login: async () => ({}) as User,
  logout: async () => {},
  handleValidateToken: async () => {},
  user: {} as User
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [requestLogin, isLoadingLogin] = useFetch<User>();
  const [requestValidateToken, isLoadingValidateToken] = useFetch<User>();
  const [isLoadingPages, setLoadingPages] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User>(initialUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const router = useRouter();

  const handleSetCookies = (token: string) => {
    setCookie(undefined, "token", token, { path: "/" });
  };

  const handleUserState = (data: User) => {
    setUser(data);
    handleSetCookies(data.token_access.token);
  };

  const login = async (formData: LoginSchemaType) => {
    const resp = await requestLogin("/api/auth/login", {
      method: "POST",
      body: formData,
    }).catch((error) => {
        console.error(error);
    });

    if (resp && resp.data) {
      handleUserState(resp.data);
      setIsAuthenticated(true);
    }
    return resp?.data as User;
  };

  const handleValidateToken = async () => {
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
  };

  const logout = async () => {
    clearSession();
    router.push("/");
  };

  const clearSession = () => {
    setUser(initialUser());
    destroyCookie(undefined, "token", { path: "/" });
    setIsAuthenticated(false);
  };

  React.useEffect(() => {
    handleValidateToken();
  }, []);

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