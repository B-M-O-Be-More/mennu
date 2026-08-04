/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Dayjs } from "dayjs";

export interface MenuPageProps {
  
}

export interface PeriodFormFields {
  start: Dayjs | null;
  end: Dayjs | null;
}

export type PeriodFilter = { 
  start: Dayjs; 
  end: Dayjs; 
} | null;
