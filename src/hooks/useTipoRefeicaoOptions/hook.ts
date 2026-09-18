import React from "react";

type Option = { label: string; value: string };
interface ApiTipoRefeicao {
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

/** Sem `unidadeId`, lista todos os tipos de refeição do tenant (uso em filtros). */
export function useTipoRefeicaoOptions(unidadeId?: string) {
  const [tipoRefeicaoOptions, setTipoRefeicaoOptions] = React.useState<Option[]>([
    { label: "Todos os tipos", value: "" },
  ]);
  const [isLoadingTipos, setIsLoadingTipos] = React.useState(false);
  const [tiposError, setTiposError] = React.useState<string | null>(null);

  const loadTipoRefeicaoOptions = React.useCallback(async () => {
    setIsLoadingTipos(true);
    setTiposError(null);

    try {
      const params = new URLSearchParams({ page_size: "200" });
      if (unidadeId) params.set("unidade_id", unidadeId);

      const response = await fetch(`/api/tipo-refeicao?${params}`);

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar tipos de refeição" }));
        throw new Error(errData.message ?? "Erro ao carregar tipos de refeição");
      }

      const payload = await response.json();
      const tipos = normalizeArrayPayload<ApiTipoRefeicao>(payload)
        .filter((tipo) => Number.isInteger(tipo.id))
        .map((tipo) => ({
          label: tipo.nome ?? `Tipo ${tipo.id}`,
          value: String(tipo.id),
        }));

      setTipoRefeicaoOptions([{ label: "Todos os tipos", value: "" }, ...tipos]);
    } catch (err) {
      setTiposError(err instanceof Error ? err.message : "Erro ao carregar tipos de refeição");
      setTipoRefeicaoOptions([{ label: "Todos os tipos", value: "" }]);
    } finally {
      setIsLoadingTipos(false);
    }
  }, [unidadeId]);

  React.useEffect(() => {
    loadTipoRefeicaoOptions();
  }, [loadTipoRefeicaoOptions]);

  return {
    tipoRefeicaoOptions,
    isLoadingTipos,
    tiposError,
    reloadTipoRefeicaoOptions: loadTipoRefeicaoOptions,
  };
}
