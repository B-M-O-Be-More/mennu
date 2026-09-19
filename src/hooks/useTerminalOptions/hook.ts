import React from "react";

type Option = { label: string; value: string };
interface ApiTerminal {
  id?: number;
  nome?: string;
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

export function useTerminalOptions() {
  const [terminalOptions, setTerminalOptions] = React.useState<Option[]>([]);
  const [isLoadingTerminals, setIsLoadingTerminals] = React.useState(false);
  const [terminalsError, setTerminalsError] = React.useState<string | null>(null);

  const loadTerminalOptions = React.useCallback(async () => {
    setIsLoadingTerminals(true);
    setTerminalsError(null);

    try {
      const response = await fetch("/api/terminais?page_size=200");

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar terminais" }));
        throw new Error(errData.message ?? "Erro ao carregar terminais");
      }

      const payload = await response.json();
      const terminais = normalizeArrayPayload<ApiTerminal>(payload)
        .filter((terminal) => Number.isInteger(terminal.id))
        .map((terminal) => ({
          label: terminal.nome ?? `Terminal ${terminal.id}`,
          value: String(terminal.id),
        }));

      setTerminalOptions(terminais);
    } catch (err) {
      setTerminalsError(err instanceof Error ? err.message : "Erro ao carregar terminais");
      setTerminalOptions([]);
    } finally {
      setIsLoadingTerminals(false);
    }
  }, []);

  React.useEffect(() => {
    loadTerminalOptions();
  }, [loadTerminalOptions]);

  return {
    terminalOptions,
    isLoadingTerminals,
    terminalsError,
    reloadTerminalOptions: loadTerminalOptions,
  };
}
