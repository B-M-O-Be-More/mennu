export interface IInventarioRow {
  insumoId: number;
  nome: string;
  categoria: string;
  tipoPadrao: string;
  unidadeMedida: string;
  quantidadeAtual: number;
  pontoReposicao: number;
  statusEstoque: "normal" | "baixo" | "critico";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowInventario(raw: any): IInventarioRow {
  return {
    insumoId: raw.insumo_id,
    nome: raw.nome ?? "—",
    categoria: raw.categoria ?? "—",
    tipoPadrao: raw.tipo_padrao ?? "—",
    unidadeMedida: raw.unidade_medida ?? "",
    quantidadeAtual: Number(raw.quantidade_atual ?? 0),
    pontoReposicao: Number(raw.ponto_reposicao ?? 0),
    statusEstoque: raw.status_estoque ?? "normal",
  };
}

/** `/relatorio-estoque/historico` — schema próprio, não confirmado idêntico a `IMovement`. */
export interface IHistoricoMovimentacaoRow {
  id: number;
  data: string;
  tipo: string;
  insumo: string;
  unidade: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
  motivo: string;
  lote: string;
  validade: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowHistoricoMovimentacao(raw: any): IHistoricoMovimentacaoRow {
  return {
    id: raw.id,
    data: raw.data,
    tipo: raw.tipo ?? "—",
    insumo: raw.insumo_nome ?? raw.insumo ?? "—",
    // `MovimentacaoEstoqueSchema` só devolve `unidade_id` (sem nome resolvido).
    unidade: raw.unidade_nome ?? (raw.unidade_id != null ? `#${raw.unidade_id}` : "—"),
    quantidade: Number(raw.quantidade ?? 0),
    responsavel: raw.criado_por_nome ?? raw.responsavel ?? "—",
    justificativa: raw.justificativa || "",
    motivo: raw.motivo || "",
    lote: raw.lote || "",
    validade: raw.validade ?? null,
  };
}

export interface IConsumoEstoqueRow {
  insumoId: number;
  nome: string;
  unidadeMedida: string;
  totalEntrada: number;
  totalSaida: number;
  totalPerda: number;
  saldoPeriodo: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowConsumoEstoque(raw: any): IConsumoEstoqueRow {
  return {
    insumoId: raw.insumo_id,
    nome: raw.nome ?? "—",
    unidadeMedida: raw.unidade_medida ?? "",
    totalEntrada: Number(raw.total_entrada ?? 0),
    totalSaida: Number(raw.total_saida ?? 0),
    totalPerda: Number(raw.total_perda ?? 0),
    saldoPeriodo: Number(raw.saldo_periodo ?? 0),
  };
}
