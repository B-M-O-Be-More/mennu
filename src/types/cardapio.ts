export type StatusCardapio = "rascunho" | "publicado" | "cancelado" | "planejado" | "servido";

export interface Prato {
  id: number;
  cardapio: number;
  tipo_prato: number;
  nome: string;
  descricao: string;
  tipo_prato_display: string;
}

export interface CardapioInsumo {
  id: number;
  cardapio: number;
  insumo: number;
  insumo_nome?: string;
  quantidade_prevista: string;
  quantidade_real: string | null;
}

export interface Cardapio {
  id: number;
  unidade: number;
  unidade_nome: string;
  data_refeicao: string;
  tipo_refeicao: number;
  tipo_refeicao_nome: string;
  status: StatusCardapio;
  numero_previsto_refeicoes: number;
  observacoes: string | null;
  pratos: Prato[];
  insumos_previstos: CardapioInsumo[];
  criado_em: string;
  atualizado_em: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  results?: T[];
  count: number;
  next: string | null;
  previous: string | null;
}
