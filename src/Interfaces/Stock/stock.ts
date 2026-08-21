export interface IStock {
  id: number;
  nome: string;
  categoria: string | null;
  tipo_padrao: string | null;
  unidade_medida: string;
  quantidade_atual: string; // Decimal retornado como string
  ponto_reposicao: string;
  ativo: boolean;
  empresa_id?: number;
  unidade_id?: number | null;
}

export interface IStockResumo {
  total_ativos: number;
  itens_criticos: number;
  movimentacoes: number;
}

export interface IStockData {
  results: IStock[];
  resumo: IStockResumo;
}
