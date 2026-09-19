export interface IPresencaRow {
  usuarioId: number;
  usuarioNome: string;
  matricula: string;
  categoria: string;
  unidade: string;
  totalRefeicoes: number;
  diasComRefeicao: number;
  frequenciaPercentual: number;
  ultimaRefeicao: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowPresenca(raw: any): IPresencaRow {
  return {
    usuarioId: raw.usuario_id,
    usuarioNome: raw.usuario_nome ?? "—",
    matricula: raw.matricula ?? "—",
    categoria: raw.categoria ?? "—",
    unidade: raw.unidade ?? "—",
    totalRefeicoes: raw.total_refeicoes ?? 0,
    diasComRefeicao: raw.dias_com_refeicao ?? 0,
    frequenciaPercentual: raw.frequencia_percentual ?? 0,
    ultimaRefeicao: raw.ultima_refeicao ?? null,
  };
}
