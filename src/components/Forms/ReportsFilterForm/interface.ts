import { Dayjs } from "dayjs";

export interface ReportsFilterFormValues {
  dataInicio: Dayjs | null;
  dataFim: Dayjs | null;
  unidadeId: string;
  tipoRefeicaoId: string;
  usuarioId: string;
}

export interface ReportsFilterFormProps {
  onChange: (filters: ReportsFilterFormValues) => void;
}
