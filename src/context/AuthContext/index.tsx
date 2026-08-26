"use client";

import React from "react";
import { UserContextProps, UserProviderProps } from "./interface";
import useFetch from "@/hooks/useFetch/hook";
import { LoginSchemaFormData } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { IUser } from "@/Interfaces/User/user";
import { initialUser, normalizeUserData } from "@/utils/userUtils";
import { getCookie, setCookie, removeCookie } from "../../utils/cookieUtils";
import Toast from "@/components/Toast";
import { AlertColor } from "@mui/material";

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

const UserProvider: React.FC<UserProviderProps> = ({ children, initialUser: serverUser }) => {
  const [requestLogin, isLoadingLogin] = useFetch<IUser>();
  const [requestValidateToken, isLoadingValidateToken] = useFetch<IUser>();
  const [requestLogout] = useFetch<unknown>();

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    return !!serverUser || !!getCookie("mennu_user_data");
  });

  const [user, setUser] = React.useState<IUser>(() => {
    if (serverUser) return serverUser;
    
    // Fallback to cookie hydration if server user is not provided
    const savedUser = getCookie("mennu_user_data");
    if (savedUser) {
      try {
        return JSON.parse(decodeURIComponent(savedUser));
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
    return initialUser();
  });

  const [isLoadingPages, setLoadingPages] = React.useState<boolean>(!serverUser);
  const hasValidatedSessionRef = React.useRef(false);

  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number;
  }>({
    open: false,
    message: "",
    severity: "info",
    duration: 3000,
  });

  const router = useRouter();

  const showToast = React.useCallback((message: string, severity: AlertColor = "info", duration: number = 3000) => {
    setToast({ open: true, message, severity, duration });
  }, []);

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleUserState = React.useCallback(
    (data: unknown) => {
      const normalized = normalizeUserData(data);
      setUser(normalized);

      // Save essential data to cookies for persistence (excluding sensitive tokens already in http-only cookies)
      const persistenceData = {
        id: normalized.id,
        nome: normalized.nome,
        email: normalized.email,
        tipo_usuario: normalized.tipo_usuario,
        status: normalized.status,
        status_acesso: normalized.status_acesso,
        avatarInitial: normalized.nome?.charAt(0)?.toUpperCase() || "U",
        permissoes: normalized.permissoes ?? [],
        acesso_total: normalized.acesso_total ?? false,
        feature_flags: normalized.feature_flags ?? [],
      };
      setCookie("mennu_user_data", encodeURIComponent(JSON.stringify(persistenceData)));
    },
    [],
  );

  const login = async (formData: LoginSchemaFormData) => {
    const resp = await requestLogin("/api/auth/login", {
      method: "POST",
      body: formData,
    }).catch(() => {});

    type LoginResponse = { data?: IUser; message?: string };

    const respData = resp as LoginResponse | IUser | undefined;
    let userData: IUser | undefined;

    if (respData && typeof respData === "object" && "data" in respData && respData.data) {
      userData = respData.data;
    } else if (respData && typeof respData === "object" && "id" in respData) {
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
    setIsAuthenticated(false);
    removeCookie("mennu_user_data");
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
      const normalized = normalizeUserData(userData);

      // Check if user is active
      if (!normalized.status || !normalized.status_acesso) {
        clearSession();
        showToast("Sua conta está inativa. Entre em contato com a administração.", "warning", 10000);
        return;
      }

      setIsAuthenticated(true);
      handleUserState(normalized);
    } else {
      clearSession();
    }
  }, [requestValidateToken, clearSession, handleUserState, showToast]);

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
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
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