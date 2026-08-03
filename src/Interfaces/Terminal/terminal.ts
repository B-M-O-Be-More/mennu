export type TerminalStatus =
  | "online"
  | "offline"
  | "desatualizado"
  | "erro"
  | "manutencao";

export type TerminalTipo = "caixa" | "totem" | "entrada" | "validador";

export interface ITerminal {
  id: number;
  nome: string;
  tipo: TerminalTipo;
  uid: string;
  status: TerminalStatus;
  versaoSoftware?: string | null;
  versaoConfiguracao: number;
  ipAddress?: string | null;
  ultimoPing?: string | null;
  refeicoesPermitidas: string[];
  categoriasPermitidas: string[];
  configuracao: Record<string, unknown>;
  ativo: boolean;
  criadoEm?: string;
  unidadeId: number;
  unidadeNome: string;
}

export interface ITerminalTokenRotation {
  terminal: ITerminal;
  serviceToken: string;
}

export interface ITerminalAccessResult {
  authorized: boolean;
  message: string;
  usuarioNome?: string;
  usuarioMatricula?: string;
  terminalNome?: string;
  unidadeNome?: string;
  timestamp?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiTerminalToUi(raw: any): ITerminal {
  return {
    id: raw.id,
    nome: raw.nome,
    tipo: raw.tipo,
    uid: raw.uid,
    status: raw.status,
    versaoSoftware: raw.versao_software ?? null,
    versaoConfiguracao: raw.versao_configuracao,
    ipAddress: raw.ip_address ?? null,
    ultimoPing: raw.ultimo_ping ?? null,
    refeicoesPermitidas: raw.refeicoes_permitidas ?? [],
    categoriasPermitidas: raw.categorias_permitidas ?? [],
    configuracao: raw.configuracao ?? {},
    ativo: raw.ativo,
    criadoEm: raw.criado_em,
    unidadeId: raw.unidade_id,
    unidadeNome: raw.unidade_nome,
  };
}

export const TERMINAL_TIPO_OPTIONS: { label: string; value: TerminalTipo }[] = [
  { label: "Caixa", value: "caixa" },
  { label: "Totem de Autoatendimento", value: "totem" },
  { label: "Controle de Acesso/Catraca", value: "entrada" },
  { label: "Validador de Refeição", value: "validador" },
];

export const CATEGORIA_USUARIO_OPTIONS: { label: string; value: string }[] = [
  { label: "Aluno", value: "ALUNO" },
  { label: "Professor", value: "PROFESSOR" },
  { label: "Funcionário", value: "FUNCIONARIO" },
  { label: "Nutricionista", value: "NUTRICIONISTA" },
  { label: "RH", value: "RH" },
  { label: "Visitante", value: "VISITANTE" },
  { label: "Terceirizado", value: "TERCEIRIZADO" },
];
