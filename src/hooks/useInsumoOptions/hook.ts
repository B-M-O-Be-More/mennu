import React from "react";

type Option = { label: string; value: string };
interface ApiInsumo {
  id?: number | null;
  nome?: string;
  unidade_medida?: string | null;
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
  // A unidade de medida não cabe no rótulo do select, mas as telas precisam
  // dela para rotular a quantidade digitada (kg, L, unid...).
  const [unidadeMedidaByInsumoId, setUnidadeMedidaByInsumoId] = React.useState<
    Record<string, string>
  >({});
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
      const insumos = normalizeArrayPayload<ApiInsumo>(payload).filter((insumo) =>
        Number.isInteger(insumo.id),
      );

      setInsumoOptions(
        insumos.map((insumo) => ({
          label: insumo.nome ?? `Insumo ${insumo.id}`,
          value: String(insumo.id),
        })),
      );
      setUnidadeMedidaByInsumoId(
        Object.fromEntries(
          insumos
            .filter((insumo) => insumo.unidade_medida)
            .map((insumo) => [String(insumo.id), String(insumo.unidade_medida)]),
        ),
      );
    } catch (err) {
      setInsumosError(err instanceof Error ? err.message : "Erro ao carregar insumos");
      setInsumoOptions([]);
      setUnidadeMedidaByInsumoId({});
    } finally {
      setIsLoadingInsumos(false);
    }
  }, []);

  React.useEffect(() => {
    loadInsumoOptions();
  }, [loadInsumoOptions]);

  return {
    insumoOptions,
    unidadeMedidaByInsumoId,
    isLoadingInsumos,
    insumosError,
    reloadInsumoOptions: loadInsumoOptions,
  };
}
