export interface IUsuariosReportRow {
  usuarioId: number;
  nome: string;
  email: string;
  matricula: string;
  categoria: string;
  ativo: boolean;
  possuiNfc: boolean;
  unidades: string;
  dataCadastro: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowUsuariosReport(raw: any): IUsuariosReportRow {
  return {
    usuarioId: raw.usuario_id,
    nome: raw.nome ?? "—",
    email: raw.email ?? "—",
    matricula: raw.matricula ?? "—",
    categoria: raw.categoria ?? "—",
    ativo: Boolean(raw.ativo),
    possuiNfc: Boolean(raw.possui_nfc),
    unidades: Array.isArray(raw.unidades) ? raw.unidades.join(", ") : "—",
    dataCadastro: raw.data_cadastro ?? null,
  };
}
