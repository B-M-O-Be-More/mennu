export interface ITerminal {
  id: string;
  nome: string;
  codigo: string;
  unidade: string;
  tipo: string;
  status: "online" | "offline" | "desatualizado";
  ultimaSync?: string;
  refeicoesPermitidas: string[];
  categoriasPermitidas: string[];
  ativo: boolean;
}