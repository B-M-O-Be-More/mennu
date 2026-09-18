import { Stack, Alert } from "@mui/material";
import { NewMenuModalProps } from ".";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createMenuSchema, CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import React from "react";
import BasicInfoStep from "./Steps/BasicInfoStep";
import PeriodStep from "./Steps/PeriodStep";
import dayjs from "dayjs";
import { computeCardapioDates } from "@/utils/menuDates";

export const mockTiposIntervalo = [
  { label: "Personalizado", value: "personalizado" },
  { label: "Semanal", value: "semanal" },
];

export default function NewMenuModal({ open, onClose, onCreated }: NewMenuModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<CreateMenuSchemaFormData>({
    resolver: yupResolver(createMenuSchema),
    defaultValues: {
      vigencia: {
        inicio: dayjs().startOf("day").add(1, "day"),
        fim: null,
      },
      unidade: "",
      tipo: "",
      numeroPrevistoRefeicoes: 0,
      observacao: "",
      tipoIntervalo: mockTiposIntervalo[0].value,
      diasSemana: [],
    },
  });

  function resetAndClose() {
    setSubmitError(null);
    setCurrentStep(0);
    reset();
    onClose();
  }

  const onSubmit = async (data: CreateMenuSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const datas = computeCardapioDates(
        data.vigencia.inicio,
        data.vigencia.fim,
        data.tipoIntervalo,
        (data.diasSemana ?? []).filter((d): d is string => !!d),
      );

      if (datas.length === 0) {
        throw new Error("Nenhuma data válida para o período informado.");
      }

      const response = await fetch("/api/cardapio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidade_id: Number(data.unidade),
          tipo_refeicao_id: Number(data.tipo),
          data_refeicao: datas,
          numero_previsto_refeicoes: data.numeroPrevistoRefeicoes,
          observacoes: data.observacao || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao criar cardápio" }));
        throw new Error(errData.detail ?? "Erro ao criar cardápio");
      }

      onCreated();
      resetAndClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao criar cardápio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Novo Cardápio"
      subtitle="Preencha as informações do cardápio"
      maxWidth="md"
    >
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {
          currentStep === 0 && (
            <PeriodStep
              errors={errors}
              trigger={trigger}
              onClose={resetAndClose}
              setCurrentStep={setCurrentStep}
              control={control}
              setValue={setValue}
            />
          )
        }

        {
          currentStep === 1 && (
            <BasicInfoStep
              register={register}
              errors={errors}
              trigger={trigger}
              setCurrentStep={setCurrentStep}
              control={control}
              isSubmitting={isSubmitting}
            />
          )
        }
      </Stack>
    </Modal>
  );
}
