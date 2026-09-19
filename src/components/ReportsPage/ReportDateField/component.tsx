"use client";

import dayjs from "dayjs";
import DatePicker from "@/components/FormControl/DatePicker";
import { ReportDateFieldProps } from "./interface";

/**
 * Date picker do MUI (com o tema do app), compacto, com o rótulo abaixo do
 * campo. Relatório é sempre sobre o passado, então o padrão trava em hoje —
 * data futura é erro que nem chega a ser cometido.
 */
export function ReportDateField({ label, name, control, minDate, maxDate }: ReportDateFieldProps) {
  return (
    <DatePicker
      label={label}
      name={name}
      control={control}
      size="small"
      labelPosition="bottom"
      minDate={minDate}
      maxDate={maxDate ?? dayjs()}
    />
  );
}
