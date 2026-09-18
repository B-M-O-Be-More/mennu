export interface IDashboardCardapioItem {
  id: number;
  tipoRefeicaoNome: string;
  status: string;
  numeroPrevistoRefeicoes: number;
}

export interface IDashboardEstoqueAlerta {
  id: number;
  nome: string;
  quantidadeAtual: number;
  pontoReposicao: number;
  critico: boolean;
}

export interface IDashboardDia {
  data: string;
  diaSemana: string;
  totalRefeicoes: number;
}

export interface IDashboardOperacional {
  dataReferencia: string;
  alertasCriticos: number;
  refeicoesPrevistas: number;
  refeicoesServidas: number;
  cardapioDoDia: IDashboardCardapioItem[];
  alertasEstoque: IDashboardEstoqueAlerta[];
  ultimos7Dias: IDashboardDia[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiDashboardToUi(raw: any): IDashboardOperacional {
  return {
    dataReferencia: raw.data_referencia,
    alertasCriticos: raw.alertas_criticos ?? 0,
    refeicoesPrevistas: raw.refeicoes_previstas ?? 0,
    refeicoesServidas: raw.refeicoes_servidas ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cardapioDoDia: (raw.cardapio_do_dia ?? []).map((item: any) => ({
      id: item.id,
      tipoRefeicaoNome: item.tipo_refeicao_nome,
      status: item.status,
      numeroPrevistoRefeicoes: item.numero_previsto_refeicoes,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alertasEstoque: (raw.alertas_estoque ?? []).map((item: any) => ({
      id: item.id,
      nome: item.nome,
      quantidadeAtual: item.quantidade_atual,
      pontoReposicao: item.ponto_reposicao,
      critico: item.critico,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ultimos7Dias: (raw.ultimos_7_dias ?? []).map((item: any) => ({
      data: item.data,
      diaSemana: item.dia_semana,
      totalRefeicoes: item.total_refeicoes,
    })),
  };
}
