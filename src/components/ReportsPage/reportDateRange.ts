import dayjs from "dayjs";

/** Range padrão dos filtros de relatório: últimos 30 dias. */
export function buildDefaultDateRange() {
  return {
    data_inicio: dayjs().subtract(29, "day"),
    data_fim: dayjs(),
  };
}
