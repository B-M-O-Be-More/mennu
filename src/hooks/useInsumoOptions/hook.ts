import React from "react";

type Option = { label: string; value: string };
interface ApiInsumo {
  id?: number | null;
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

export function useInsumoOptions() {
  const [insumoOptions, setInsumoOptions] = React.useState<Option[]>([]);
  const [isLoadingInsumos, setIsLoadingInsumos] = React.useState(false);
  const [insumosError, setInsumosError] = React.useState<string | null>(null);

  const loadInsumoOptions = React.useCallback(async () => {
    setIsLoadingInsumos(true);
    setInsumosError(null);

    try {
      const response = await fetch("/api/insumo?page_size=200");

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar insumos" }));
        throw new Error(errData.message ?? "Erro ao carregar insumos");
      }

      const payload = await response.json();
      const insumos = normalizeArrayPayload<ApiInsumo>(payload)
        .filter((insumo) => Number.isInteger(insumo.id))
        .map((insumo) => ({
          label: insumo.nome ?? `Insumo ${insumo.id}`,
          value: String(insumo.id),
        }));

      setInsumoOptions(insumos);
    } catch (err) {
      setInsumosError(err instanceof Error ? err.message : "Erro ao carregar insumos");
      setInsumoOptions([]);
    } finally {
      setIsLoadingInsumos(false);
    }
  }, []);

  React.useEffect(() => {
    loadInsumoOptions();
  }, [loadInsumoOptions]);

  return {
    insumoOptions,
    isLoadingInsumos,
    insumosError,
    reloadInsumoOptions: loadInsumoOptions,
  };
}
