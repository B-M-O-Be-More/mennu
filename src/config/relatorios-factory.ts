export interface RelatorioModulo {
  id: string;
  label: string;
  featureFlag: string;
  previewEndpoint: string;
  exportEndpoint: string;
}

export const RELATORIOS_FACTORY: RelatorioModulo[] = [
  {
    id: "refeicoes",
    label: "Refeições",
    featureFlag: "relatorio.refeicoes",
    previewEndpoint: "/api/relatorio/refeicoes-servidas",
    exportEndpoint: "/api/relatorio/refeicoes-servidas/exportar",
  },
  {
    id: "acesso",
    label: "Acesso",
    featureFlag: "relatorio.acesso",
    previewEndpoint: "/api/relatorio/controle-acesso",
    exportEndpoint: "/api/relatorio/controle-acesso/exportar",
  },
  {
    id: "presenca",
    label: "Presença",
    featureFlag: "relatorio.presenca",
    previewEndpoint: "/api/relatorio/presenca",
    exportEndpoint: "/api/relatorio/presenca/exportar",
  },
  {
    id: "usuarios",
    label: "Usuários",
    featureFlag: "relatorio.usuarios",
    previewEndpoint: "/api/relatorio/usuarios",
    exportEndpoint: "/api/relatorio/usuarios/exportar",
  },
  {
    id: "terminais",
    label: "Terminais",
    featureFlag: "relatorio.terminais",
    previewEndpoint: "/api/relatorio/terminais",
    exportEndpoint: "/api/relatorio/terminais/exportar",
  },
  {
    id: "consumo",
    label: "Consumo",
    featureFlag: "relatorio.consumo",
    previewEndpoint: "/api/relatorio/consumo",
    exportEndpoint: "/api/relatorio/consumo/exportar",
  },
  {
    id: "estoque",
    label: "Estoque",
    featureFlag: "relatorio.estoque",
    previewEndpoint: "/api/relatorio-estoque",
    exportEndpoint: "/api/relatorio-estoque/exportar",
  },
  {
    id: "cardapio",
    label: "Cardápio",
    featureFlag: "relatorio.cardapio",
    previewEndpoint: "/api/relatorio/cardapio-planejamento",
    exportEndpoint: "/api/relatorio/cardapio-planejamento/exportar",
  },
  {
    id: "gerencial",
    label: "Gerencial",
    featureFlag: "relatorio.gerencial",
    previewEndpoint: "/api/relatorio/gerencial",
    exportEndpoint: "/api/relatorio/gerencial/exportar",
  },
];
