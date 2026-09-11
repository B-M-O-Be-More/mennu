export interface PaginatedResponse<T> {
  results: T[];
  count?: number;
  total?: number;
  page?: number;
  page_size?: number;
}

export interface GeneralSettingsApi {
  id: number;
  logo_url: string | null;
  nome_sistema: string;
  descricao: string;
  notificacoes_email: boolean;
  modo_manutencao: boolean;
  atualizado_em: string;
}

export interface GeneralSettingsUpdateApi {
  nome_sistema?: string;
  descricao?: string;
  notificacoes_email?: boolean;
  modo_manutencao?: boolean;
}

export interface SecuritySettingsApi {
  id: number;
  tempo_sessao_minutos: number;
  max_tentativas_login: number;
  autenticacao_dois_fatores: boolean;
  log_atividades: boolean;
  atualizado_em: string;
}

export interface SecuritySettingsUpdateApi {
  tempo_sessao_minutos: number;
  max_tentativas_login: number;
  autenticacao_dois_fatores: boolean;
  log_atividades: boolean;
}

export interface UnitResponsibleApi {
  id: number;
  nome: string;
  email?: string;
}

export interface MealPolicyApi {
  tipo_refeicao: string;
  horario_inicio: string;
  horario_fim: string;
  limite_diario?: number;
  limite_semanal?: number;
  limite_mensal?: number;
  categoria_usuario?: string | null;
  permitir_extra?: boolean;
  tempo_minimo_entre_refeicoes?: number;
}

export interface UnitPolicyConfigApi {
  permitir_multiplas_refeicoes?: boolean;
  horario_flexivel?: boolean;
  horario_flexivel_inicio?: string | null;
  horario_flexivel_fim?: string | null;
  reserva_obrigatoria?: boolean;
  dias_semana_permitidos?: number[];
  janela_turno_inicio?: string | null;
  janela_turno_fim?: string | null;
  politicas?: MealPolicyApi[];
  limite_diario_global?: number;
  limite_semanal_global?: number;
  limite_mensal_global?: number;
  intervalo_minimo?: number;
}

export interface UnitApi {
  id: number;
  nome: string;
  endereco: string | null;
  ativo: boolean;
  status: string;
  responsavel: UnitResponsibleApi | null;
  horario_abertura: string | null;
  horario_fechamento: string | null;
  politicas: UnitPolicyConfigApi | null;
  total_usuarios: number;
}

export interface UnitCreateApi {
  nome: string;
  endereco?: string | null;
  responsavel?: number | null;
}

export interface UnitUpdateApi extends UnitCreateApi {
  ativo?: boolean;
}

export interface UnitListItem {
  id: number;
  nome: string;
  endereco: string;
  responsavelId: number | null;
  responsavelNome: string;
  ativo: boolean;
  status: "ativo" | "inativo";
  politicas: UnitPolicyConfigApi;
  horarioAbertura: string | null;
  horarioFechamento: string | null;
}

export interface UnitFormValues {
  nome: string;
  endereco: string;
  responsavelId: string;
  ativo: "ativo" | "inativo";
}

export interface ResponsibleOption {
  id: number;
  nome: string;
}

export interface UnitPoliciesFormValues {
  tiposRefeicao: Array<{
    tipoRefeicaoId: number | null;
    nome: string;
    horarioInicio: string;
    horarioFim: string;
    ordem: number;
    isNew: boolean;
  }>;
  limites: { diario: number; semanal: number; mensal: number };
}
