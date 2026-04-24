export interface ITerminal {
  id: string;
  nome: string;
  unidade: string;
  unidadeId?: number;
  tipo: string;
  status: "ONLINE" | "OFFLINE" | "DESATUALIZADO" | "ERRO" | "MANUTENCAO";
  ultimaSync?: string;
  refeicoesPermitidas?: string[];
  ativo: boolean;
}
