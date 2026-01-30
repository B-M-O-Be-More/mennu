export const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

export function normalizeDate(value?: string) {
  if (!value) return value;

  const parts = value.split("/");

  if (parts.length !== 3) return value; 

  let [day, month, year] = parts;

  if (!day || !month || !year) return value;

  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  return `${day}/${month}/${year}`;
}
