export const timeRegex = /^([01]?\d|2[0-3])(:[0-5]?\d)?$/;

export function normalizeTime(value?: string) {
  if (!value || !timeRegex.test(value)) return value;

  let [hours, minutes = "0"] = value.split(":");

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  return `${hours}:${minutes}`;
}
