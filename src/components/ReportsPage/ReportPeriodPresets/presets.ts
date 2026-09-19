import dayjs from "dayjs";
import { PeriodPreset } from "./interface";

/** Semana/mês corrente ancoram em hoje — dois relatórios abertos no mesmo dia sempre concordam sem precisar de `new Date()` combinado com fuso. */
export const DEFAULT_PERIOD_PRESETS: PeriodPreset[] = [
  { label: "Hoje", build: () => ({ dataInicio: dayjs(), dataFim: dayjs() }) },
  { label: "7 dias", build: () => ({ dataInicio: dayjs().subtract(6, "day"), dataFim: dayjs() }) },
  { label: "30 dias", build: () => ({ dataInicio: dayjs().subtract(29, "day"), dataFim: dayjs() }) },
  { label: "Mês atual", build: () => ({ dataInicio: dayjs().startOf("month"), dataFim: dayjs() }) },
  { label: "90 dias", build: () => ({ dataInicio: dayjs().subtract(89, "day"), dataFim: dayjs() }) },
];
