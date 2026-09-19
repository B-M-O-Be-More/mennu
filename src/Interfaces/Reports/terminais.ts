export interface ITerminaisRow {
  terminalId: number;
  nome: string;
  tipo: string;
  unidade: string;
  statusAtual: string;
  ultimoPing: string | null;
  versaoSoftware: string | null;
  ipAddress: string | null;
  totalAcessos: number;
  acessosSucesso: number;
  taxaSucesso: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowTerminais(raw: any): ITerminaisRow {
  return {
    terminalId: raw.terminal_id,
    nome: raw.nome ?? "—",
    tipo: raw.tipo ?? "—",
    unidade: raw.unidade ?? "—",
    statusAtual: raw.status_atual ?? "—",
    ultimoPing: raw.ultimo_ping ?? null,
    versaoSoftware: raw.versao_software ?? null,
    ipAddress: raw.ip_address ?? null,
    totalAcessos: raw.total_acessos ?? 0,
    acessosSucesso: raw.acessos_sucesso ?? 0,
    taxaSucesso: raw.taxa_sucesso ?? 0,
  };
}
