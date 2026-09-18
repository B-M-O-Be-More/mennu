import React from "react";

type Option = { label: string; value: string };
interface ApiUser {
  id?: number;
  nome?: string | null;
}

function normalizeArrayPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };

    if (Array.isArray(root.results)) return root.results as T[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as T[];
    }
  }

  return [];
}

export function useUserOptions() {
  const [userOptions, setUserOptions] = React.useState<Option[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [usersError, setUsersError] = React.useState<string | null>(null);

  const loadUserOptions = React.useCallback(async () => {
    setIsLoadingUsers(true);
    setUsersError(null);

    try {
      const response = await fetch("/api/usuarios?page_size=200");

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar usuários" }));
        throw new Error(errData.message ?? "Erro ao carregar usuários");
      }

      const payload = await response.json();
      const users = normalizeArrayPayload<ApiUser>(payload)
        .filter((user) => Number.isInteger(user.id))
        .map((user) => ({
          label: user.nome ?? `Usuário ${user.id}`,
          value: String(user.id),
        }));

      setUserOptions(users);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : "Erro ao carregar usuários");
      setUserOptions([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  React.useEffect(() => {
    loadUserOptions();
  }, [loadUserOptions]);

  return {
    userOptions,
    isLoadingUsers,
    usersError,
    reloadUserOptions: loadUserOptions,
  };
}
