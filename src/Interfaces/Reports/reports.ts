export interface ReportsConsumptionHistoryItem {
  id: number;
  dataHora: string;
  usuarioNome: string | null;
  usuarioMatricula: string | null;
  unidadeNome: string | null;
  manual: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRefeicaoToHistoryItem(raw: any): ReportsConsumptionHistoryItem {
  return {
    id: raw.id,
    dataHora: raw.data_hora,
    usuarioNome: raw.usuario_nome ?? null,
    usuarioMatricula: raw.usuario_matricula ?? null,
    unidadeNome: raw.unidade_nome ?? null,
    manual: raw.manual ?? false,
  };
}
