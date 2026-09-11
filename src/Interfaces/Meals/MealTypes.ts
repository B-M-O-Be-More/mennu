import { ReactElement } from "react";
import { ChipProps } from "@mui/material";

export interface ValidationProps {
  id: string;
  label: string;
  shortLabel?: string;
  description: string;
  icon: ReactElement;
  chipColor?: ChipProps["color"];
}

export interface Unit {
  id: string;
  label: string;
}

export interface MealTypeResponse {
  id: string;
  typeName: string;
  description: string;
  startTime?: string;
  endTime?: string;
  status?: boolean;
  validations?: ValidationProps[];
  units: Unit[];
}

export interface CreateMealTypePayload {
  typeName: string;
  description: string;
  startTime?: string | null;
  endTime?: string | null;
  status?: boolean;
  validations?: string[];
  units: string[];
}
export type UpdateMealTypePayload = CreateMealTypePayload & { typeId: string };

export interface TipoRefeicaoUnidadeApi {
  id: number;
  nome: string;
}

export interface TipoRefeicaoApi {
  id: number;
  nome: string;
  unidade: TipoRefeicaoUnidadeApi;
  horario_inicio: string;
  horario_fim: string;
  ordem: number;
  exige_pesagem: boolean;
  leitura_cartao: boolean;
  confirmacao_manual: boolean;
  ativo: boolean;
}

export interface TipoRefeicaoCreateApi {
  nome: string;
  unidade_id: number;
  horario_inicio: string;
  horario_fim: string;
  ordem: number;
  exige_pesagem?: boolean;
  leitura_cartao?: boolean;
  confirmacao_manual?: boolean;
}

export interface TipoRefeicaoUpdateApi {
  nome?: string;
  horario_inicio?: string;
  horario_fim?: string;
  ordem?: number;
  exige_pesagem?: boolean;
  leitura_cartao?: boolean;
  confirmacao_manual?: boolean;
  ativo?: boolean;
}

export interface TipoRefeicaoPaginatedApi {
  message?: string;
  metadados?: {
    page?: number;
    page_size?: number;
    total?: number;
    total_pages?: number;
  };
  results: TipoRefeicaoApi[];
}

export interface MealRuleResponse {
  id: string;
  unit: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  minInterval: number;
  isTimeRestricted: boolean;
}

export interface MealRecordsResponse {
  isManual?: boolean;
  usuario: string;
  matricula: string;
  tipo: string;
  unidade: string;
  horario: string;
  terminal: string;
  status: "Servida" | "Pendente" | "Cancelada";
}
export interface ManualMealRecordPayload {
  usuario_id: number;
  cardapio_id: number;
  motivo: string;
}
