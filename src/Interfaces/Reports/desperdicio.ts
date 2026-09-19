export interface IDesperdicioRow {
  insumoId: number;
  nome: string;
  unidadeMedida: string;
  categoria: string;
  totalPerda: number;
  percentualPerda: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowDesperdicio(raw: any): IDesperdicioRow {
  return {
    insumoId: raw.insumo_id,
    nome: raw.nome ?? "—",
    unidadeMedida: raw.unidade_medida ?? "",
    categoria: raw.categoria ?? "—",
    totalPerda: Number(raw.total_perda ?? 0),
    percentualPerda: Number(raw.percentual_perda ?? 0),
  };
}

/** `desperdicio` não tem `/preview` — cards vêm direto do `/resumo`. */
export interface IDesperdicioResumoCard {
  label: string;
  value: string | number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiResumoDesperdicioCards(raw: any): IDesperdicioResumoCard[] {
  return [
    { label: "Insumos com Perda", value: raw.total_insumos_com_perda ?? 0 },
    { label: "Perda Total no Período", value: raw.total_perda_geral ?? 0 },
    { label: "Perda Média (%)", value: raw.percentual_perda_medio ?? 0 },
  ];
}
