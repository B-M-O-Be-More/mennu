import dayjs from "dayjs";

export function timeRangeFormToApi(data: {
  startTime?: unknown;
  endTime?: unknown;
}) {
  const start = dayjs.isDayjs(data.startTime) ? data.startTime : null;
  const end = dayjs.isDayjs(data.endTime) ? data.endTime : null;

  return {
    startTime: start?.second(0).millisecond(0).toISOString() ?? null,
    endTime: end?.second(0).millisecond(0).toISOString() ?? null,
  };
}

export function timeRangeApiToForm(data: {
  startTime?: string | null;
  endTime?: string | null;
}) {
  return {
    startTime: data.startTime ? dayjs(data.startTime) : null,
    endTime: data.endTime ? dayjs(data.endTime) : null,
  };
}
