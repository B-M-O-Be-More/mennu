export interface IStock {
  id: number;
  nome: string;
  categoria: string | null;
  tipo_padrao: string | null;
  unidade_medida: string;
  quantidade_atual: string; // Decimal retornado como string
  ponto_reposicao: string;
  ativo: boolean;
  unidade_id?: number | null;
}
