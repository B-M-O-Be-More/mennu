export interface ISaldoEstoqueItem {
  id: number;
  unidadeId: number;
  unidadeNome: string | null;
  insumoId: number;
  insumoNome: string | null;
  unidadeMedida: string | null;
  lote: string | null;
  validade: string | null;
  quantidade: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiSaldoEstoqueItem(raw: any): ISaldoEstoqueItem {
  return {
    id: raw.id,
    unidadeId: raw.unidade_id,
    unidadeNome: raw.unidade_nome ?? null,
    insumoId: raw.insumo_id,
    insumoNome: raw.insumo_nome ?? null,
    unidadeMedida: raw.unidade_medida ?? null,
    lote: raw.lote ?? null,
    validade: raw.validade ?? null,
    quantidade: raw.quantidade,
  };
}

export interface ISaldoEstoqueConsolidado {
  insumoId: number;
  insumoNome: string;
  unidadeMedida: string;
  quantidade: string;
  validadeMaisProxima: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiSaldoEstoqueConsolidado(raw: any): ISaldoEstoqueConsolidado {
  return {
    insumoId: raw.insumo_id,
    insumoNome: raw.insumo_nome,
    unidadeMedida: raw.unidade_medida,
    quantidade: raw.quantidade,
    validadeMaisProxima: raw.validade_mais_proxima ?? null,
  };
}
