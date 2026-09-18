export interface IRefeicoesServidasResumo {
  totalPeriodo: number;
  mediaDiaria: number;
  totalManuais: number;
  totalAutomaticas: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiResumoRefeicoesServidas(raw: any): IRefeicoesServidasResumo {
  return {
    totalPeriodo: raw.total_periodo ?? 0,
    mediaDiaria: raw.media_diaria ?? 0,
    totalManuais: raw.total_manuais ?? 0,
    totalAutomaticas: raw.total_automaticas ?? 0,
  };
}

export interface IRefeicoesServidasRow {
  data: string;
  unidade: string;
  tipoRefeicao: string;
  totalServidas: number;
  manuais: number;
  automaticas: number;
  percentualManual: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowRefeicoesServidas(raw: any): IRefeicoesServidasRow {
  return {
    data: raw.data,
    unidade: raw.unidade,
    tipoRefeicao: raw.tipo_refeicao,
    totalServidas: raw.total_servidas ?? 0,
    manuais: raw.manuais ?? 0,
    automaticas: raw.automaticas ?? 0,
    percentualManual: raw.percentual_manual ?? 0,
  };
}

export interface IRefeicoesServidasChartPonto {
  label: string;
  valor: number;
}

export interface IRefeicoesServidasPreview {
  grafico: IRefeicoesServidasChartPonto[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiPreviewRefeicoesServidas(raw: any): IRefeicoesServidasPreview {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grafico: (raw.grafico?.pontos ?? []).map((p: any) => ({
      label: p.label,
      valor: p.valor,
    })),
  };
}
