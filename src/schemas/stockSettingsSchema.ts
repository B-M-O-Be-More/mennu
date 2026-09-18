import * as yup from "yup";
import { StockToleranceType } from "@/Interfaces/Settings/settings";
import { inputDecimalToApi } from "@/utils/decimalInputAdapter";

const DECIMAL_INPUT_PATTERN = /^\d{1,10}(?:[.,]\d{1,2})?$/;

export const stockSettingsSchema = yup.object({
  toleranceType: yup
    .mixed<StockToleranceType>()
    .oneOf(["absoluto", "percentual"])
    .required("Selecione o tipo de tolerância"),
  toleranceMargin: yup
    .string()
    .trim()
    .required("A margem de tolerância é obrigatória")
    .matches(
      DECIMAL_INPUT_PATTERN,
      "Informe zero ou um valor positivo com até duas casas decimais",
    )
    .test(
      "percentage-limit",
      "A margem percentual deve ser de no máximo 100%",
      function validatePercentage(value) {
        if (!value || this.parent.toleranceType !== "percentual") return true;
        return Number(inputDecimalToApi(value)) <= 100;
      },
    ),
});

export type StockSettingsFormData = yup.InferType<typeof stockSettingsSchema>;
