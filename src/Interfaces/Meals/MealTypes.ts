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
  status?: string | undefined;
  validations?: ValidationProps[];
  units: Unit[];
}

export interface CreateMealTypePayload {
  typeName: string;
  description: string;
  startTime?: string | null;
  endTime?: string | null;
  status?: string;
  validations?: string[];
  units: string[];
}
export type UpdateMealTypePayload = CreateMealTypePayload & { typeId: string };

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
  isManual: true;
  user: string;
  mealType: string;
  dateTime?: string | null;
  reason: string;
}
