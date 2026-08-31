"use client";

import React from "react";
import { UserContextProps, UserProviderProps } from "./interface";
import useFetch from "@/hooks/useFetch/hook";
import { LoginSchemaFormData } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { IUser } from "@/Interfaces/User/user";
import { IUserContext } from "@/Interfaces/User/context";
import { initialUser, normalizeUserData } from "@/utils/userUtils";
import {
  SELECT_UNIT_ROUTE,
  applyContextToUser,
  findUserContext,
  getUserContexts,
  parseUnidadeId,
} from "@/utils/userContextUtils";
import { UNIDADE_COOKIE, USER_DATA_COOKIE } from "@/utils/authCookies";
import { getCookie, setCookie, removeCookie } from "../../utils/cookieUtils";
import Toast from "@/components/Toast";
import { AlertColor } from "@mui/material";

const UserContext = React.createContext<UserContextProps>({
  isAuthenticated: false,
  isLoadingLogin: true,
  isLoadingPages: true,
  isLoadingValidateToken: true,
  login: async () => null,
  logout: async () => {},
  handleValidateToken: async () => {},
  user: {} as IUser,
  contexts: [],
  activeContext: null,
  isLoadingContext: false,
  selectContext: async () => {},
  clearContext: async () => {},
});

/**
 * A API responde o usuário ora embrulhado em `data`, ora achatado na raiz — e
 * nesse segundo formato não vem `id`. Por isso o reconhecimento do payload usa
 * `email`/`nome`, e não a presença de `id`.
 */
function extractUserPayload(resp: unknown): Partial<IUser> | null {
  if (!resp || typeof resp !== "object") return null;

  // `useFetch` injeta `message` na resposta achatada; ele não faz parte do usuário.
  const flat = { ...(resp as Record<string, unknown>) };
  delete flat.message;

  const wrapped = (resp as { data?: unknown }).data;
  const payload = (
    wrapped && typeof wrapped === "object" ? wrapped : flat
  ) as Partial<IUser>;

  const isUser = Boolean(payload.email || payload.nome || payload.id);

  return isUser ? payload : null;
}

const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUser: serverUser,
  initialUnidadeId,
}) => {
  const [requestLogin, isLoadingLogin] = useFetch<IUser>();
  const [requestValidateToken, isLoadingValidateToken] = useFetch<IUser>();
  const [requestLogout] = useFetch<unknown>();
  const [requestContext, isLoadingContext] = useFetch<unknown>();

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    return !!serverUser || !!getCookie(USER_DATA_COOKIE);
  });

  /**
   * Usuário como a API devolveu, com todos os `contextos`. O que a aplicação
   * consome é o `user` derivado abaixo, já recortado pela unidade ativa.
   */
  const [sessionUser, setSessionUser] = React.useState<IUser>(() => {
    if (serverUser) return serverUser;

    // Fallback to cookie hydration if server user is not provided
    const savedUser = getCookie(USER_DATA_COOKIE);
    if (savedUser) {
      try {
        return JSON.parse(decodeURIComponent(savedUser));
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
    return initialUser();
  });

  /**
   * Unidade ativa. Vem do servidor no primeiro render — mesmo cookie que os
   * route handlers usam para montar o header `unidade-id-x` —, com leitura no
   * client como fallback.
   */
  const [activeUnidadeId, setActiveUnidadeId] = React.useState<number | null>(
    () =>
      parseUnidadeId(initialUnidadeId) ?? parseUnidadeId(getCookie(UNIDADE_COOKIE)),
  );

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

  const contexts = React.useMemo(
    () => getUserContexts(sessionUser),
    [sessionUser],
  );

  /**
   * `null` enquanto o usuário não escolher — ou quando a unidade guardada
   * deixou de existir entre os vínculos (acesso revogado, por exemplo).
   */
  const activeContext = React.useMemo(
    () => findUserContext(sessionUser, activeUnidadeId),
    [sessionUser, activeUnidadeId],
  );

  /** Usuário recortado pela unidade ativa — é o que alimenta `<Can />`. */
  const user = React.useMemo(
    () => applyContextToUser(sessionUser, activeContext),
    [sessionUser, activeContext],
  );

  const handleUserState = React.useCallback(
    (data: unknown): IUser => {
      const normalized = normalizeUserData(data);
      setSessionUser(normalized);

      // Save essential data to cookies for persistence (excluding sensitive
      // tokens already in http-only cookies).
      //
      // As permissões ficam de fora: agora são por contexto, e a lista de
      // slugs de todas as unidades estoura o limite de 4 KB do cookie. Elas
      // vêm de `/auth/ativo` a cada carga — até lá `isLoadingPages` segura a
      // renderização do conteúdo restrito.
      const persistenceData = {
        id: normalized.id,
        nome: normalized.nome,
        email: normalized.email,
        tipo_usuario: normalized.tipo_usuario,
        status: normalized.status,
        status_acesso: normalized.status_acesso,
        avatarInitial: normalized.nome?.charAt(0)?.toUpperCase() || "U",
        feature_flags: normalized.feature_flags ?? [],
      };
      setCookie(USER_DATA_COOKIE, encodeURIComponent(JSON.stringify(persistenceData)));

      return normalized;
    },
    [],
  );

  const login = async (formData: LoginSchemaFormData) => {
    const resp = await requestLogin("/api/auth/login", {
      method: "POST",
      body: formData,
    }).catch(() => undefined);

    const userData = extractUserPayload(resp);

    if (!userData) {
      showToast("Não foi possível concluir o login. Tente novamente.", "error", 6000);
      return null;
    }

    const normalized = handleUserState(userData);
    setIsAuthenticated(true);
    // O route handler do login já zerou o cookie da unidade; aqui zera o
    // espelho em memória, para o guard levar à seleção de unidade.
    setActiveUnidadeId(null);
    router.push(SELECT_UNIT_ROUTE);

    return normalized;
  };

  const clearSession = React.useCallback(() => {
    setSessionUser(initialUser());
    setIsAuthenticated(false);
    setActiveUnidadeId(null);
    removeCookie(USER_DATA_COOKIE);
    removeCookie(UNIDADE_COOKIE);
  }, []);

  /**
   * Fixa a unidade da sessão: a partir daqui todo request sai com o header
   * `unidade-id-x` e as permissões da UI passam a ser as desse contexto.
   */
  const selectContext = React.useCallback(
    async (contexto: IUserContext) => {
      const persisted = await requestContext("/api/auth/contexto", {
        method: "POST",
        body: {
          empresa_id: contexto.empresa_id,
          unidade_id: contexto.unidade_id,
        },
      })
        .then(() => true)
        .catch(() => false);

      if (!persisted) {
        showToast(
          "Não foi possível entrar nesta unidade. Tente novamente.",
          "error",
          6000,
        );
        return;
      }

      setActiveUnidadeId(contexto.unidade_id);
      router.push("/dashboard");
    },
    [requestContext, router, showToast],
  );

  /** "Trocar unidade": derruba o escopo atual sem encerrar a sessão. */
  const clearContext = React.useCallback(async () => {
    await requestContext("/api/auth/contexto", { method: "DELETE" }).catch(
      () => {},
    );

    removeCookie(UNIDADE_COOKIE);
    setActiveUnidadeId(null);
    router.push(SELECT_UNIT_ROUTE);
  }, [requestContext, router]);

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
        contexts,
        activeContext,
        isLoadingContext,
        selectContext,
        clearContext,
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
