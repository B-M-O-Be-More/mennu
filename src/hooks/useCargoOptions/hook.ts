import React from "react";

type Option = { label: string; value: string };
interface ApiCargo {
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

/**
 * Opções de cargo para selects. `enabled` evita gastar a requisição enquanto
 * o consumidor está fechado (modal), e refaz a busca a cada abertura — cargo
 * criado em outra aba já aparece na próxima vez que o modal abre.
 */
export function useCargoOptions(enabled: boolean = true) {
  const [cargoOptions, setCargoOptions] = React.useState<Option[]>([]);
  const [isLoadingCargos, setIsLoadingCargos] = React.useState(false);
  const [cargosError, setCargosError] = React.useState<string | null>(null);

  const loadCargoOptions = React.useCallback(async () => {
    setIsLoadingCargos(true);
    setCargosError(null);

    try {
      const response = await fetch("/api/cargos?page_size=200");

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar cargos" }));
        throw new Error(errData.message ?? "Erro ao carregar cargos");
      }

      const payload = await response.json();
      const cargos = normalizeArrayPayload<ApiCargo>(payload)
        .filter((cargo) => Number.isInteger(cargo.id))
        .map((cargo) => ({
          label: cargo.nome ?? `Cargo ${cargo.id}`,
          value: String(cargo.id),
        }));

      setCargoOptions(cargos);
    } catch (err) {
      setCargosError(err instanceof Error ? err.message : "Erro ao carregar cargos");
      setCargoOptions([]);
    } finally {
      setIsLoadingCargos(false);
    }
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    loadCargoOptions();
  }, [enabled, loadCargoOptions]);

  return {
    cargoOptions,
    isLoadingCargos,
    cargosError,
    reloadCargoOptions: loadCargoOptions,
  };
}
