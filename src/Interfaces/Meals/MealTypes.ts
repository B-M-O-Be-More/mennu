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
  startTime?: string | undefined;
  endTime?: string | undefined;
  status?: string | undefined;
  validations?: ValidationProps[];
  units: Unit[];
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
