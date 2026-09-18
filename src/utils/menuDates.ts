import { Dayjs } from "dayjs";

const WEEKDAY_MAP: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

/**
 * Computa as datas reais de um período de cardápio. `personalizado` = todo
 * dia entre início e fim; `semanal` = só os dias da semana selecionados
 * dentro desse intervalo. Sem fim, assume um único dia (fim = início).
 */
export function computeCardapioDates(
  inicio: Dayjs,
  fim: Dayjs | null | undefined,
  tipoIntervalo: string,
  diasSemana: string[],
): string[] {
  const dataFim = fim ?? inicio;
  const allowedWeekdays =
    tipoIntervalo === "semanal"
      ? new Set(diasSemana.map((d) => WEEKDAY_MAP[d]))
      : null;

  const dates: string[] = [];
  let cursor = inicio.startOf("day");
  const end = dataFim.startOf("day");

  while (!cursor.isAfter(end)) {
    if (!allowedWeekdays || allowedWeekdays.has(cursor.day())) {
      dates.push(cursor.format("YYYY-MM-DD"));
    }
    cursor = cursor.add(1, "day");
  }

  return dates;
}
