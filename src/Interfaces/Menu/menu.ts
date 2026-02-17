export interface IMenu {
  id: number;
  data: string;
  unidade: string;
  tipo: string;
  horario: {
    inicio: string;
    fim: string;
  };
  refeicoes: IMenuItems[];
  status: "ativo" | "programado" | "finalizado";
  observacao: string | null;
}

interface IMenuItemCategoria {
  categoria: "prato principal" | "acompanhamento" | "sobremesa" | "bebida" | "salada";
}

export interface IMenuItems extends IMenuItemCategoria {
  id: number;
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
  refeicao: IMenuItems;
  status: "liberado" | "bloqueado";
  tipo: "manual" | "automático";
}

export interface IReportMenu extends IMenuItemCategoria {
  id: number;
  data: string;
  planejado: number;
  realizado: number;
  variacao: number;
  eficiencia: number;
}
