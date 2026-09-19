import { Dayjs } from "dayjs";

export interface ReportPeriodPresetsProps {
  dataInicio?: Dayjs;
  dataFim?: Dayjs;
  onSelect: (dataInicio: Dayjs, dataFim: Dayjs) => void;
  /** Esconde presets que não fazem sentido pro relatório (ex.: "Hoje" num relatório sempre mensal). */
  presets?: PeriodPreset[];
}

export interface PeriodPreset {
  label: string;
  build: () => { dataInicio: Dayjs; dataFim: Dayjs };
}
