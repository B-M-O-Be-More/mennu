export interface CardPreview {
  icone: string;
  label: string;
  valor: string;
  cor?: string;
}

export interface GraficoPonto {
  label: string;
  valor: number;
}

export interface GraficoPreview {
  titulo: string;
  tipo: "barra" | "linha" | "barra_horizontal";
  pontos: GraficoPonto[];
}

export interface LinksExportar {
  csv: string;
  pdf: string;
}

export interface RelatorioPreview {
  titulo: string;
  subtitulo: string;
  icone: string;
  gerado_em: string;
  periodo: {
    data_inicio: string;
    data_fim: string;
  };
  resumo_cards: CardPreview[];
  grafico: GraficoPreview;
  links: LinksExportar;
}
