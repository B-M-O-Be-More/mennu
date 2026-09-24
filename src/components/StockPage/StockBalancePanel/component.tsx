import { Alert, Box, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import React from "react";
import Card from "@/components/Cards/Card";
import Table from "@/components/Tables/Table";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm, useWatch, useController } from "react-hook-form";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { saldoEstoqueColumns, saldoEstoqueConsolidadoColumns } from "@/data/tableColumns";
import {
  ISaldoEstoqueItem,
  ISaldoEstoqueConsolidado,
  mapApiSaldoEstoqueItem,
  mapApiSaldoEstoqueConsolidado,
} from "@/Interfaces/Stock/saldoEstoque";
import { StockBalancePanelProps } from "./interface";

interface FilterFields {
  unidadeId: string;
  lote: string;
  comSaldo: boolean;
}

export default function StockBalancePanel({ refreshToken = 0 }: StockBalancePanelProps) {
  const { unitOptions } = useUnitFilterOptions();
  const { control, register } = useForm<FilterFields>({
    defaultValues: { unidadeId: "all", lote: "", comSaldo: true },
  });
  const { field: comSaldoField } = useController({ name: "comSaldo", control });

  const filters = useWatch({ control });
  const debouncedLote = useDebounce(filters.lote, 500);

  const [items, setItems] = React.useState<ISaldoEstoqueItem[]>([]);
  const [consolidado, setConsolidado] = React.useState<ISaldoEstoqueConsolidado[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSaldoDeUmaUnidade = React.useCallback(async (unidadeId?: string) => {
    const params = new URLSearchParams();
    if (unidadeId) params.set("unidade_id", unidadeId);
    if (debouncedLote) params.set("lote", debouncedLote);
    params.set("com_saldo", String(filters.comSaldo ?? true));
    params.set("page_size", "200");

    const results: ISaldoEstoqueItem[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const pageParams = new URLSearchParams(params);
      pageParams.set("page", String(page));
      const response = await fetch(`/api/saldo-estoque?${pageParams}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Erro ao carregar saldo de estoque");
      }
      const pageResults = Array.isArray(payload.results) ? payload.results : [];
      results.push(...pageResults.map(mapApiSaldoEstoqueItem));
      totalPages = payload.metadados?.total_pages ?? 1;
      page += 1;
    } while (page <= totalPages);

    return results;
  }, [debouncedLote, filters.comSaldo]);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Backend nunca mistura unidades num request só: sem `unidade_id`
        // explícito, `/saldo-estoque/` cai no header `Unidade-id-x` da
        // sessão (só a unidade ativa), nunca "a rede toda". "Todas as
        // unidades" aqui, então, busca uma vez por unidade e junta.
        const unidadesReais = unitOptions.filter((o) => o.value !== "all");
        const allResults =
          filters.unidadeId && filters.unidadeId !== "all"
            ? await fetchSaldoDeUmaUnidade(filters.unidadeId)
            : (await Promise.all(unidadesReais.map((o) => fetchSaldoDeUmaUnidade(o.value)))).flat();

        let consolidadoResults: ISaldoEstoqueConsolidado[] = [];
        if (filters.unidadeId && filters.unidadeId !== "all") {
          const response = await fetch(`/api/saldo-estoque/unidade/${filters.unidadeId}`);
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || "Erro ao carregar resumo da unidade");
          }
          consolidadoResults = (Array.isArray(payload) ? payload : []).map(mapApiSaldoEstoqueConsolidado);
        }

        if (cancelled) return;
        setItems(allResults);
        setConsolidado(consolidadoResults);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar saldo de estoque");
        setItems([]);
        setConsolidado([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters.unidadeId, debouncedLote, filters.comSaldo, refreshToken, unitOptions, fetchSaldoDeUmaUnidade]);

  return (
    <Card>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack gap={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          alignItems="flex-start"
        >
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Select
              label="Unidade"
              options={unitOptions}
              name="unidadeId"
              control={control}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Input
              label="Lote"
              placeholder="Ex: L2026-001"
              register={register("lote")}
            />
          </Box>
        </Stack>

        <FormControlLabel
          sx={{ ml: 0, mr: 0, gap: 1 }}
          control={
            <Switch
              checked={!!comSaldoField.value}
              onChange={(e) => comSaldoField.onChange(e.target.checked)}
            />
          }
          label="Somente com saldo"
        />
      </Stack>

      {filters.unidadeId && filters.unidadeId !== "all" && consolidado.length > 0 && (
        <Box>
          <Typography variant="body1" marginBottom={1}>Resumo por Insumo</Typography>
          <Table columns={saldoEstoqueConsolidadoColumns} rows={consolidado} initialRowsPerPage={5} />
        </Box>
      )}

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Saldo por Lote</Typography>
          {!isLoading && (
            <Typography variant="body2" color="text.secondary">
              {items.length} registros
            </Typography>
          )}
        </Stack>
        <Table columns={saldoEstoqueColumns} rows={items} initialRowsPerPage={10} isLoading={isLoading} />
      </Box>
    </Card>
  );
}
