import React from "react";
import { IColumn } from "@/components/Tables/Table";
import { PermissionCode } from "@/Interfaces/ProfilePermissions/profilePermissions";
import {
  CalendarIcon,
  LockIcon,
  CircledCheckIcon,
  UsuariosIcon,
  TerminalIcon,
  UsuariosCheckIcon,
  EstoqueIcon,
  TrashIcon,
  RelatoriosIcon,
  PaperIcon,
  StatsIcon,
} from "@/components/Icons";
import {
  reportsMenuColumns,
  acessoColumns,
  auditoriaRelatorioColumns,
  presencaColumns,
  terminaisColumns,
  usuariosReportColumns,
  auditoriaOptionalColumns,
  terminaisOptionalColumns,
  usuariosOptionalColumns,
  insumoVariacaoColumns,
} from "./tableColumns";
import {
  ICardapioPlanejamentoRow,
  mapApiRowCardapioPlanejamento,
  mapApiRowInsumoVariacao,
} from "@/Interfaces/Reports/cardapioPlanejamento";
import { mapApiRowAcesso } from "@/Interfaces/Reports/acesso";
import { mapApiRowAuditoria } from "@/Interfaces/Reports/auditoria";
import { mapApiRowPresenca } from "@/Interfaces/Reports/presenca";
import { mapApiRowTerminais } from "@/Interfaces/Reports/terminais";
import { mapApiRowUsuariosReport } from "@/Interfaces/Reports/usuarios";
import { IDesperdicioResumoCard } from "@/Interfaces/Reports/desperdicio";

/** Card genérico de resumo — mesma forma pra qualquer relatório, venha do `/preview` ou de um `/resumo` cru. */
export interface IReportResumoCard {
  label: string;
  value: string | number;
  /** `CardPreviewSchema.cor` — sempre presente quando vem do `/preview`; ausente nos que só têm `/resumo` cru. */
  cor?: string;
}

export interface IReportChartPonto {
  label: string;
  valor: number;
}

/**
 * `RelatorioPreviewSchema.resumo_cards`/`grafico` já vêm formatados pelo
 * backend (mesma forma pros 8 relatórios do engine) — um único par de
 * mappers cobre todos, sem precisar de um `mapResumo` por relatório.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPreviewCards(raw: any): IReportResumoCard[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (raw?.resumo_cards ?? []).map((c: any) => ({ label: c.label, value: c.valor, cor: c.cor }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPreviewChart(raw: any): { titulo: string; tipo: string; pontos: IReportChartPonto[] } {
  return {
    titulo: raw?.grafico?.titulo ?? "",
    tipo: raw?.grafico?.tipo ?? "barra",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pontos: (raw?.grafico?.pontos ?? []).map((p: any) => ({ label: p.label, valor: p.valor })),
  };
}

export type FilterFieldConfig =
  | { type: "dateRange" }
  | { type: "unidade" }
  | { type: "tipoRefeicao" }
  | { type: "insumo" }
  | { type: "terminal" }
  | { type: "usuario"; field: string; label: string }
  | { type: "select"; field: string; label: string; options: { label: string; value: string }[] };

export interface ReportEndpoints {
  listar: string;
  preview?: string;
  resumo?: string;
  exportar: string;
}

/**
 * Uma 3ª aba opcional pra um recorte adicional do MESMO relatório (hoje,
 * só o Cardápio tem — `insumos-variacao`). Reaproveita o período+unidade já
 * aplicados na tela; carrega só quando a aba é aberta, não em toda visita.
 */
export interface ReportExtraView {
  label: string;
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: IColumn<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRow: (raw: any) => any;
}

export interface ReportCatalogEntry {
  slug: string;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  /** Tom claro da mesma cor do ícone — mesmo par cor forte/fundo claro dos cards da dashboard. */
  iconBgColor: string;
  permission: PermissionCode;
  endpoints: ReportEndpoints;
  filterFields: FilterFieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: IColumn<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRow: (raw: any) => any;
  /** Só preenchido quando o relatório não tem `/preview` (hoje, só `desperdicio`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapResumoCardsFallback?: (raw: any) => IDesperdicioResumoCard[];
  /**
   * `applied[filterField] -> columnKey`: quando esse filtro está fixado
   * num valor específico (não vazio, não "all"/"todos"), a coluna some da
   * tabela — todo registro visível já compartilha aquele valor, repeti-lo
   * em toda linha só ocupa espaço. É a personalização "de graça": não pede
   * clique nenhum além do filtro que o usuário já aplicou.
   */
  contextColumns?: Record<string, string>;
  /** Campos que existem na resposta mas ficam fora da tabela padrão — ligáveis via <ReportColumnsMenu/>. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalColumns?: IColumn<any>[];
  extraView?: ReportExtraView;
}

const SUCESSO_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Sucesso", value: "true" },
  { label: "Falha", value: "false" },
];

const STATUS_AUDITORIA_OPTIONS = [
  { label: "Todos os status", value: "" },
  { label: "Rascunho", value: "rascunho" },
  { label: "Enviada", value: "enviada" },
  { label: "Finalizada", value: "finalizada" },
];

const CATEGORIA_USUARIO_OPTIONS = [
  { label: "Todas as categorias", value: "" },
  { label: "Funcionário", value: "FUNCIONARIO" },
  { label: "Terceiro", value: "TERCEIRO" },
  { label: "Visitante", value: "VISITANTE" },
];

const ATIVO_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ativo", value: "true" },
  { label: "Inativo", value: "false" },
];

const NFC_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Com NFC", value: "true" },
  { label: "Sem NFC", value: "false" },
];

const STATUS_TERMINAL_OPTIONS = [
  { label: "Todos os status", value: "" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

const TIPO_TERMINAL_OPTIONS = [
  { label: "Todos os tipos", value: "" },
  { label: "Totem", value: "totem" },
  { label: "Mobile", value: "mobile" },
];

const DIVERGENTES_OPTIONS = [
  { label: "Todos os itens", value: "" },
  { label: "Só divergentes", value: "true" },
];

export const REPORTS_CATALOG: ReportCatalogEntry[] = [
  {
    slug: "cardapio",
    titulo: "Cardápio e Planejamento",
    descricao: "Aderência entre previsto e realizado por cardápio",
    icon: React.createElement(CalendarIcon, { color: "#1447E6" }),
    iconBgColor: "#EFF6FF",
    permission: "relatorio.view.cardapio",
    endpoints: {
      listar: "/api/relatorio/cardapio-planejamento/",
      preview: "/api/relatorio/cardapio-planejamento/preview",
      exportar: "/api/relatorio/cardapio-planejamento/exportar",
    },
    filterFields: [
      { type: "dateRange" },
      { type: "unidade" },
      { type: "tipoRefeicao" },
      {
        type: "select",
        field: "status",
        label: "Status",
        options: [
          { label: "Todos os status", value: "" },
          { label: "Planejado", value: "planejado" },
          { label: "Confirmado", value: "confirmado" },
          { label: "Servido", value: "servido" },
        ],
      },
    ],
    columns: reportsMenuColumns as IColumn<ICardapioPlanejamentoRow>[],
    mapRow: mapApiRowCardapioPlanejamento,
    contextColumns: { unidade_id: "unidade", tipo_refeicao_id: "tipoRefeicao", status: "status" },
    extraView: {
      label: "Variação de Insumos",
      endpoint: "/api/relatorio/cardapio-planejamento/insumos-variacao",
      columns: insumoVariacaoColumns,
      mapRow: mapApiRowInsumoVariacao,
    },
  },
  {
    slug: "acesso",
    titulo: "Controle de Acesso",
    descricao: "Tentativas de acesso aos terminais, sucessos e falhas",
    icon: React.createElement(LockIcon, { color: "#E7000B" }),
    iconBgColor: "#FEF2F2",
    permission: "relatorio.view.acesso",
    endpoints: {
      listar: "/api/relatorio/controle-acesso/",
      preview: "/api/relatorio/controle-acesso/preview",
      exportar: "/api/relatorio/controle-acesso/exportar",
    },
    filterFields: [
      { type: "dateRange" },
      { type: "terminal" },
      { type: "select", field: "sucesso", label: "Resultado", options: SUCESSO_OPTIONS },
      { type: "tipoRefeicao" },
    ],
    columns: acessoColumns,
    mapRow: mapApiRowAcesso,
    contextColumns: { terminal_id: "terminal", tipo_refeicao_id: "tipoRefeicao", sucesso: "sucesso" },
  },
  {
    slug: "auditoria",
    titulo: "Auditoria de Estoque",
    descricao: "Itens conferidos, divergências e tratamento",
    icon: React.createElement(CircledCheckIcon, { color: "#8200DB" }),
    iconBgColor: "#FAF5FF",
    permission: "relatorio.view.auditoria",
    endpoints: {
      listar: "/api/relatorio/auditoria/",
      preview: "/api/relatorio/auditoria/preview",
      exportar: "/api/relatorio/auditoria/exportar",
    },
    filterFields: [
      { type: "dateRange" },
      { type: "unidade" },
      { type: "usuario", field: "auditor_id", label: "Auditor" },
      { type: "select", field: "status", label: "Status", options: STATUS_AUDITORIA_OPTIONS },
      { type: "insumo" },
      { type: "select", field: "apenas_divergentes", label: "Divergência", options: DIVERGENTES_OPTIONS },
    ],
    columns: auditoriaRelatorioColumns,
    mapRow: mapApiRowAuditoria,
    contextColumns: {
      unidade_id: "unidade",
      auditor_id: "auditor",
      insumo_id: "insumo",
      status: "status",
      apenas_divergentes: "divergente",
    },
    optionalColumns: auditoriaOptionalColumns,
  },
  {
    slug: "presenca",
    titulo: "Presença e Frequência",
    descricao: "Adesão dos usuários ao restaurante no período",
    icon: React.createElement(UsuariosIcon, { color: "#00A63E" }),
    iconBgColor: "#F0FDF4",
    permission: "relatorio.view.presenca",
    endpoints: {
      listar: "/api/relatorio/presenca/",
      preview: "/api/relatorio/presenca/preview",
      exportar: "/api/relatorio/presenca/exportar",
    },
    filterFields: [
      { type: "dateRange" },
      { type: "unidade" },
      { type: "select", field: "categoria_usuario", label: "Categoria", options: CATEGORIA_USUARIO_OPTIONS },
      { type: "tipoRefeicao" },
    ],
    columns: presencaColumns,
    mapRow: mapApiRowPresenca,
    contextColumns: { unidade_id: "unidade", categoria_usuario: "categoria" },
  },
  {
    slug: "terminais",
    titulo: "Terminais e Disponibilidade",
    descricao: "Status, ping e taxa de sucesso dos terminais",
    icon: React.createElement(TerminalIcon, { color: "#155DFC" }),
    iconBgColor: "#EFF6FF",
    permission: "relatorio.view.terminais",
    endpoints: {
      listar: "/api/relatorio/terminais/",
      preview: "/api/relatorio/terminais/preview",
      exportar: "/api/relatorio/terminais/exportar",
    },
    filterFields: [
      { type: "unidade" },
      { type: "select", field: "status", label: "Status", options: STATUS_TERMINAL_OPTIONS },
      { type: "select", field: "tipo", label: "Tipo", options: TIPO_TERMINAL_OPTIONS },
      { type: "dateRange" },
    ],
    columns: terminaisColumns,
    mapRow: mapApiRowTerminais,
    contextColumns: { unidade_id: "unidade", status: "statusAtual", tipo: "tipo" },
    optionalColumns: terminaisOptionalColumns,
  },
  {
    slug: "usuarios",
    titulo: "Usuários e Perfis",
    descricao: "Cadastro, categoria e credencial NFC dos usuários",
    icon: React.createElement(UsuariosCheckIcon, { color: "#E17100" }),
    iconBgColor: "#FFFBEB",
    permission: "relatorio.view.usuarios",
    endpoints: {
      listar: "/api/relatorio/usuarios/",
      preview: "/api/relatorio/usuarios/preview",
      exportar: "/api/relatorio/usuarios/exportar",
    },
    filterFields: [
      { type: "unidade" },
      { type: "select", field: "categoria_usuario", label: "Categoria", options: CATEGORIA_USUARIO_OPTIONS },
      { type: "select", field: "ativo", label: "Status", options: ATIVO_OPTIONS },
      { type: "select", field: "possui_nfc", label: "Credencial NFC", options: NFC_OPTIONS },
    ],
    columns: usuariosReportColumns,
    mapRow: mapApiRowUsuariosReport,
    contextColumns: { categoria_usuario: "categoria", ativo: "ativo", possui_nfc: "possuiNfc" },
    optionalColumns: usuariosOptionalColumns,
  },
];

export function findReportEntry(slug: string): ReportCatalogEntry | undefined {
  return REPORTS_CATALOG.find((entry) => entry.slug === slug);
}

/**
 * Metadados de card pros relatórios que NÃO passam pelo `ReportViewer`
 * genérico — cada um renderiza um componente próprio (ver
 * `src/components/ReportsPage/component.tsx`). `refeicoes-dashboard` e
 * `refeicoes-historico` reaproveitam telas já testadas (`DashboardTab`,
 * `ConsumptionHistoryTab`) sob a mesma permissão `relatorio.view.refeicoes`.
 */
export interface BespokeReportEntry {
  slug: string;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  iconBgColor: string;
  permission: PermissionCode;
}

export const BESPOKE_REPORTS: BespokeReportEntry[] = [
  {
    slug: "consumo",
    titulo: "Consumo e Desperdício",
    descricao: "Entradas, saídas e perdas de insumos, com aba de desperdício",
    icon: React.createElement(TrashIcon, { color: "#00A63E" }),
    iconBgColor: "#F0FDF4",
    // `relatorio.view.consumo` e `.desperdicio` são sempre concedidos juntos
    // pelo mesmo módulo do plano (`relatorios_consumo`) — 1 permissão basta
    // pro card; a aba Desperdício em si não teria como aparecer sem a outra.
    permission: "relatorio.view.consumo",
  },
  {
    slug: "refeicoes-dashboard",
    titulo: "Dashboard de Refeições",
    descricao: "KPIs e rankings dos últimos 7 dias",
    icon: React.createElement(RelatoriosIcon, { color: "#00A63E" }),
    iconBgColor: "#F0FDF4",
    permission: "relatorio.view.refeicoes",
  },
  {
    slug: "refeicoes-historico",
    titulo: "Histórico de Consumo",
    descricao: "Refeições registradas, filtráveis por período e unidade",
    icon: React.createElement(PaperIcon, { color: "#1447E6" }),
    iconBgColor: "#EFF6FF",
    permission: "relatorio.view.refeicoes",
  },
  {
    slug: "estoque",
    titulo: "Estoque e Inventário",
    descricao: "Inventário atual, histórico de movimentação e consumo",
    icon: React.createElement(EstoqueIcon, { color: "#8200DB" }),
    iconBgColor: "#FAF5FF",
    permission: "relatorio.view.estoque",
  },
  {
    slug: "gerencial",
    titulo: "Relatório Gerencial Consolidado",
    descricao: "KPIs de operação, estoque e tecnologia num só lugar",
    icon: React.createElement(StatsIcon, { color: "#E17100" }),
    iconBgColor: "#FFFBEB",
    permission: "relatorio.view.gerencial",
  },
];
