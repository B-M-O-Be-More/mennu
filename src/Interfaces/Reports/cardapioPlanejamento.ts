export interface ICardapioPlanejamentoResumo {
  totalCardapios: number;
  totalRefeicoesPrevistas: number;
  totalRefeicoesRealizadas: number;
  aderenciaMedia: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiResumoCardapioPlanejamento(raw: any): ICardapioPlanejamentoResumo {
  return {
    totalCardapios: raw.total_cardapios ?? 0,
    totalRefeicoesPrevistas: raw.total_refeicoes_previstas ?? 0,
    totalRefeicoesRealizadas: raw.total_refeicoes_realizadas ?? 0,
    aderenciaMedia: raw.aderencia_media ?? 0,
  };
}

export interface ICardapioPlanejamentoChartPonto {
  label: string;
  valor: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiPreviewCardapioPlanejamento(raw: any): ICardapioPlanejamentoChartPonto[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (raw.grafico?.pontos ?? []).map((p: any) => ({ label: p.label, valor: p.valor }));
}

export interface ICardapioPlanejamentoRow {
  cardapioId: number;
  data: string;
  unidade: string;
  tipoRefeicao: string;
  status: string;
  previsto: number;
  realizado: number;
  aderencia: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowCardapioPlanejamento(raw: any): ICardapioPlanejamentoRow {
  return {
    cardapioId: raw.cardapio_id,
    data: raw.data,
    unidade: raw.unidade,
    tipoRefeicao: raw.tipo_refeicao,
    status: raw.status,
    previsto: raw.previsto ?? 0,
    realizado: raw.realizado ?? 0,
    aderencia: raw.aderencia ?? 0,
  };
}
