import dayjs, { Dayjs } from "dayjs";

export function mealTypeFormToApi(data: {
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
}) {
  return {
    startTime: data.startTime
      ? data.startTime.second(0).millisecond(0).toISOString()
      : null,
    endTime: data.endTime
      ? data.endTime.second(0).millisecond(0).toISOString()
      : null,
  };
}

export function mealTypeApiToForm(data: {
  startTime?: string | null;
  endTime?: string | null;
}) {
  return {
    startTime: data.startTime ? dayjs(data.startTime) : null,
    endTime: data.endTime ? dayjs(data.endTime) : null,
  };
}
