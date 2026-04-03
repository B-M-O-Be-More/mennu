// types/insumo.ts

export interface Insumo {
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

export interface InsumoCreateRequest {
  nome: string;
  categoria?: string;
  tipo_padrao?: string;
  unidade_medida: string;
  ponto_reposicao?: string;
  unidade_id?: number;
}

export type InsumoUpdateRequest = Partial<InsumoCreateRequest>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
