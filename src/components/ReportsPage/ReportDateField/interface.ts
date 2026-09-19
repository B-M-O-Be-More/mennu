import { Control } from "react-hook-form";
import { Dayjs } from "dayjs";

export interface ReportDateFieldProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  minDate?: Dayjs;
  /** Padrão: hoje — relatório não aceita data futura. */
  maxDate?: Dayjs;
}
