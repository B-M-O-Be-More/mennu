import React from "react";

type Option = { label: string; value: string };
interface ApiUnit {
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

function dedupeOptions(options: Option[]): Option[] {
  return Array.from(new Map(options.map((option) => [option.value, option])).values());
}

export function useUnitFilterOptions() {
  const [unitOptions, setUnitOptions] = React.useState<Option[]>([
    { label: "Todas as unidades", value: "all" },
  ]);
  const [isLoadingUnits, setIsLoadingUnits] = React.useState(false);
  const [unitsError, setUnitsError] = React.useState<string | null>(null);

  const loadUnitOptions = React.useCallback(async () => {
    setIsLoadingUnits(true);
    setUnitsError(null);

    try {
      const response = await fetch("/api/unidades");

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar unidades" }));
        throw new Error(errData.message ?? "Erro ao carregar unidades");
      }

      const payload = await response.json();
      const units = normalizeArrayPayload<ApiUnit>(payload)
        .map((unit) => ({
          label: unit.nome ?? "Unidade",
          value: String(unit.id ?? unit.nome ?? ""),
        }))
        .filter((option) => option.value);

      setUnitOptions(
        dedupeOptions([
          { label: "Todas as unidades", value: "all" },
          ...units,
        ]),
      );
    } catch (err) {
      setUnitsError(err instanceof Error ? err.message : "Erro ao carregar unidades");
      setUnitOptions([{ label: "Todas as unidades", value: "all" }]);
    } finally {
      setIsLoadingUnits(false);
    }
  }, []);

  React.useEffect(() => {
    loadUnitOptions();
  }, [loadUnitOptions]);

  return {
    unitOptions,
    isLoadingUnits,
    unitsError,
    reloadUnitOptions: loadUnitOptions,
  };
}
