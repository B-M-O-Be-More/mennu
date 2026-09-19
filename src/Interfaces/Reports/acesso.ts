export interface IAcessoRow {
  id: number;
  dataHora: string;
  terminal: string;
  unidade: string;
  usuario: string;
  tipoRefeicao: string;
  sucesso: boolean;
  mensagemErro: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowAcesso(raw: any): IAcessoRow {
  return {
    id: raw.id,
    dataHora: raw.data_hora,
    terminal: raw.terminal ?? "—",
    unidade: raw.unidade ?? "—",
    usuario: raw.usuario ?? "—",
    tipoRefeicao: raw.tipo_refeicao ?? "—",
    sucesso: Boolean(raw.sucesso),
    mensagemErro: raw.mensagem_erro ?? "",
  };
}
