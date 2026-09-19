export interface IKPIOperacao {
  totalRefeicoes: number;
  mediaDiaria: number;
  taxaPresenca: number;
  aderenciaCardapio: number;
  refeicoesManuais: number;
  percentualManuais: number;
}

export interface IKPIEstoque {
  itensCriticos: number;
  itensBaixoEstoque: number;
  taxaDesperdicio: number;
  totalInsumos: number;
}

export interface IKPITecnologia {
  totalTerminais: number;
  disponibilidadeTerminais: number;
  taxaFalhaAcesso: number;
  totalAcessos: number;
}

export interface IRelatorioGerencial {
  dataInicio: string;
  dataFim: string;
  unidade: string | null;
  operacao: IKPIOperacao;
  estoque: IKPIEstoque;
  tecnologia: IKPITecnologia;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRelatorioGerencial(raw: any): IRelatorioGerencial {
  const operacao = raw.operacao ?? {};
  const estoque = raw.estoque ?? {};
  const tecnologia = raw.tecnologia ?? {};

  return {
    dataInicio: raw.data_inicio,
    dataFim: raw.data_fim,
    unidade: raw.unidade ?? null,
    operacao: {
      totalRefeicoes: operacao.total_refeicoes ?? 0,
      mediaDiaria: operacao.media_diaria ?? 0,
      taxaPresenca: operacao.taxa_presenca ?? 0,
      aderenciaCardapio: operacao.aderencia_cardapio ?? 0,
      refeicoesManuais: operacao.refeicoes_manuais ?? 0,
      percentualManuais: operacao.percentual_manuais ?? 0,
    },
    estoque: {
      itensCriticos: estoque.itens_criticos ?? 0,
      itensBaixoEstoque: estoque.itens_baixo_estoque ?? 0,
      taxaDesperdicio: estoque.taxa_desperdicio ?? 0,
      totalInsumos: estoque.total_insumos ?? 0,
    },
    tecnologia: {
      totalTerminais: tecnologia.total_terminais ?? 0,
      disponibilidadeTerminais: tecnologia.disponibilidade_terminais ?? 0,
      taxaFalhaAcesso: tecnologia.taxa_falha_acesso ?? 0,
      totalAcessos: tecnologia.total_acessos ?? 0,
    },
  };
}
