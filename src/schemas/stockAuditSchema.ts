import type { Dayjs } from "dayjs";
import * as yup from "yup";

export const createStockAuditSchema = yup.object({
  unidade_id: yup.string().required("Selecione a unidade"),
  auditor_id: yup.string().required("Selecione o auditor responsável"),
  data_visita: yup
    .mixed<Dayjs>()
    .nullable()
    .test("data-valida", "Informe a data da visita", (value) =>
      Boolean(value && value.isValid()),
    )
    .required("Informe a data da visita"),
  observacao_geral: yup.string().optional(),
});

export type CreateStockAuditFormData = yup.InferType<
  typeof createStockAuditSchema
>;
