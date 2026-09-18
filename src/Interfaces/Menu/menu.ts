export type StatusCardapio = "planejado" | "confirmado" | "servido";

export type TipoPrato = "principal" | "guarnicao" | "salada" | "sobremesa" | "bebida";

export type RestricaoAlimentar = "vegetariano" | "vegano" | "sem_gluten" | "sem_lactose";

export interface IPrato {
  id: number;
  cardapioId: number;
  tipoPrato: TipoPrato;
  nome: string;
  descricao: string | null;
  restricoes: RestricaoAlimentar[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiPrato(raw: any): IPrato {
  return {
    id: raw.id,
    cardapioId: raw.cardapio,
    tipoPrato: raw.tipo_prato,
    nome: raw.nome,
    descricao: raw.descricao ?? null,
    restricoes: raw.restricoes ?? [],
  };
}

export interface ICardapioInsumo {
  id: number;
  cardapioId: number;
  insumoId: number;
  insumoNome: string;
  quantidadePrevista: string;
  quantidadeReal: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiCardapioInsumo(raw: any): ICardapioInsumo {
  return {
    id: raw.id,
    cardapioId: raw.cardapio,
    insumoId: raw.insumo,
    insumoNome: raw.insumo_nome,
    quantidadePrevista: raw.quantidade_prevista,
    quantidadeReal: raw.quantidade_real ?? null,
  };
}

export interface IMenu {
  id: number;
  unidadeId: number;
  unidadeNome: string;
  dataRefeicao: string;
  tipoRefeicaoId: number;
  tipoRefeicaoNome: string;
  tipoRefeicaoOrdem: number;
  status: StatusCardapio;
  numeroPrevistoRefeicoes: number;
  observacoes: string | null;
  pratos: IPrato[];
  insumosPrevistos: ICardapioInsumo[];
  criadoEm: string | null;
  atualizadoEm: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiCardapio(raw: any): IMenu {
  return {
    id: raw.id,
    unidadeId: raw.unidade,
    unidadeNome: raw.unidade_nome,
    dataRefeicao: raw.data_refeicao,
    tipoRefeicaoId: raw.tipo_refeicao,
    tipoRefeicaoNome: raw.tipo_refeicao_nome,
    tipoRefeicaoOrdem: raw.tipo_refeicao_ordem,
    status: raw.status,
    numeroPrevistoRefeicoes: raw.numero_previsto_refeicoes ?? 0,
    observacoes: raw.observacoes ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pratos: (raw.pratos ?? []).map((p: any) => mapApiPrato(p)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insumosPrevistos: (raw.insumos_previstos ?? []).map((i: any) => mapApiCardapioInsumo(i)),
    criadoEm: raw.criado_em ?? null,
    atualizadoEm: raw.atualizado_em ?? null,
  };
}

/**
 * Shape só de `ConsumptionTab`, que monta esse sub-objeto localmente a partir
 * de `tipo_refeicao_nome` — não é a entidade Prato real (que exige tipo_prato
 * do enum fixo), só um rótulo livre pra exibição na tabela de consumo.
 */
interface IConsumptionMealLabel {
  id: number;
  categoria: string;
  nome: string;
  descricao: string;
  restricoes: string[];
  status: "ativo" | "inativo";
}

export interface IConsumptionHistory {
  id: number;
  user: {
    id: number;
    nome: string;
    matricula: string;
  }
  data: string;
  horario: string;
  refeicao: IConsumptionMealLabel;
  status: "liberado" | "bloqueado";
  tipo: "manual" | "automático";
}
