export const dateRegex = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

export function normalizeDate(value?: string) {
  if (!value || !dateRegex.test(value)) return value;

  let [day, month, year] = value.split("/");

  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  const date = new Date(+year, +month - 1, +day);

  if (
    date.getFullYear() !== +year ||
    date.getMonth() !== +month - 1 ||
    date.getDate() !== +day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}
