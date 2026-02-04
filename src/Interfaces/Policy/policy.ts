export interface IPolicy {
  horarios: {
    cafeManha: {
      inicio: string;
      fim: string;
    };
    almoco: {
      inicio: string;
      fim: string;
    };
    jantar: {
      inicio: string;
      fim: string;
    };
  }
  limites: {
    diario: number;
    semanal: number;
    mensal: number;
  };
}

export interface IAccessPolicy {
  permitirMultiplasRefeicoes: boolean;
  horarioFlexivel: {
    permitido: boolean;
    horarioInicio: string;
    horarioFim: string;
  };
  reservaObrigatoria: boolean;
}
