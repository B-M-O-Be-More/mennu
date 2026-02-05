import dayjs, { Dayjs } from "dayjs";

export function mealRecordFormToApi(data: {
  date?: Dayjs | null;
  time?: Dayjs | null;
}) {
  if (!data.date || !data.time) return null;

  return dayjs(data.date)
    .hour(data.time.hour())
    .minute(data.time.minute())
    .second(0)
    .millisecond(0)
    .toISOString();
}

export function mealRecordApiToForm(iso?: string) {
  if (!iso) {
    return {
      date: null,
      time: null,
    };
  }

  const parsed = dayjs(iso);

    return {
    date: parsed.startOf("day"),
    time: parsed,
  };
}
