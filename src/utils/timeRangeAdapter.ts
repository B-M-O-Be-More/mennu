import dayjs from "dayjs";

const API_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

export function apiTimeToInput(value?: string | null): string {
  const match = value?.match(API_TIME_PATTERN);
  return match ? `${match[1]}:${match[2]}` : "";
}

export function inputTimeToApi(value: string): string {
  const match = value.match(API_TIME_PATTERN);
  return match ? `${match[1]}:${match[2]}:${match[3] ?? "00"}` : "";
}

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
