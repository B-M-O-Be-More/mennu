export interface IConsumoRow {
  insumoId: number;
  nome: string;
  unidadeMedida: string;
  categoria: string;
  totalEntrada: number;
  totalSaida: number;
  saldoPeriodo: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowConsumo(raw: any): IConsumoRow {
  return {
    insumoId: raw.insumo_id,
    nome: raw.nome ?? "—",
    unidadeMedida: raw.unidade_medida ?? "",
    categoria: raw.categoria ?? "—",
    totalEntrada: Number(raw.total_entrada ?? 0),
    totalSaida: Number(raw.total_saida ?? 0),
    saldoPeriodo: Number(raw.saldo_periodo ?? 0),
  };
}
