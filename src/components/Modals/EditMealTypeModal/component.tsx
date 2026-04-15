import { Alert, Box, Button, Stack } from "@mui/material";
import Modal from "../Modal";
import { EditMealTypeModalProps } from "./interface";
import TextArea from "@/components/FormControl/TextArea";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import MealValidationList from "@/components/MealsPage/MealValidationList";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealTypeInput, MealTypeSchema } from "@/schemas/mealTypeSchema";
import { mockStatuses } from "@/data/menuItems";
import React from "react";
import { mealValidations } from "@/data/meals";
import TimePicker from "@/components/FormControl/TimePicker";
import {
  timeRangeApiToForm,
} from "@/utils/timeRangeAdapter";
import dayjs from "dayjs";

interface UpdateTipoRefeicaoPayload {
  nome: string;
  horario_inicio: string;
  horario_fim: string;
  ordem?: number;
  exige_pesagem?: boolean;
  leitura_cartao?: boolean;
  confirmacao_manual?: boolean;
  ativo?: boolean;
}

interface UnidadeApiItem {
  id?: number | null;
  nome?: string;
}

function normalizeUnits(payload: unknown): { id: string; label: string }[] {
  const source =
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { results?: unknown }).results)
      ? ((payload as { results: UnidadeApiItem[] }).results ?? [])
      : Array.isArray(payload)
        ? (payload as UnidadeApiItem[])
        : [];

  return source
    .filter((unit) => Number.isInteger(unit.id) && !!unit.nome)
    .map((unit) => ({
      id: String(unit.id),
      label: String(unit.nome),
    }));
}

function toTimeValue(value: unknown) {
  return dayjs.isDayjs(value) ? value.format("HH:mm:ss") : "";
}

export function EditMealTypeModal({
  open,
  onClose,
  typeId,
  initialData,
  onSuccess,
  onNotify,
}: EditMealTypeModalProps) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [unitsOptions, setUnitsOptions] = React.useState<
    { id: string; label: string }[]
  >([]);
  const [isLoadingUnits, setIsLoadingUnits] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MealTypeSchema),
    defaultValues: {
      ...initialData,
      units: initialData.units.map((u) => u.id),
      validations: initialData.validations?.map((v) => v.id),
    },
  });

  React.useEffect(() => {
    if (open && initialData) {
      const timeISO = timeRangeApiToForm(initialData);

      reset({
        ...initialData,
        ...timeISO,
        units: initialData.units.map((u) => u.id),
        validations: initialData.validations?.map((v) => v.id),
      });
    }
  }, [open, initialData, reset]);

  const loadUnits = React.useCallback(async () => {
    setIsLoadingUnits(true);

    try {
      const response = await fetch("/api/unidades");
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar unidades" }));
        throw new Error(errData.message ?? "Erro ao carregar unidades");
      }

      const payload = await response.json();
      setUnitsOptions(normalizeUnits(payload));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar unidades",
      );
    } finally {
      setIsLoadingUnits(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      loadUnits();
    }
  }, [open, loadUnits]);

  function resetAndClose() {
    setErrorMessage(null);
    reset();
    onClose();
  }

  const onEdit = async (data: MealTypeInput) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const horarioInicio = toTimeValue(data.startTime);
      const horarioFim = toTimeValue(data.endTime);

      if (!horarioInicio || !horarioFim) {
        throw new Error("Preencha horário de início e horário de fim.");
      }

      const payload: UpdateTipoRefeicaoPayload = {
        nome: data.typeName,
        horario_inicio: horarioInicio,
        horario_fim: horarioFim,
        ordem: 0,
        exige_pesagem: data.validations?.includes("pesagem") ?? false,
        leitura_cartao: data.validations?.includes("cartao") ?? false,
        confirmacao_manual: data.validations?.includes("extra") ?? false,
        ativo: typeof data.status === "boolean" ? data.status : undefined,
      };

      const response = await fetch(`/api/tipo-refeicao/${typeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao atualizar tipo de refeição" }));
        throw new Error(errData.message ?? "Erro ao atualizar tipo de refeição");
      }

      onNotify?.("Tipo de refeição atualizado com sucesso", "success");
      onSuccess?.();
      resetAndClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao atualizar tipo de refeição";

      setErrorMessage(message);
      onNotify?.(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Tipo de Refeição">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onEdit)}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Stack gap={2}>
          <Input
            label="Nome do tipo"
            placeholder="Ex. Café da Manhã"
            optional={false}
            register={register("typeName")}
            error={errors.typeName?.message}
          />

          <TextArea
            label="Descrição"
            placeholder="Descreva este tipo de refeição"
            optional={false}
            register={register("description")}
            error={errors.description?.message}
          />
        </Stack>

        <Stack direction={"row"} gap={2}>
          <Box width={"50%"}>
            <TimePicker
              label="Horário de início"
              control={control}
              name="startTime"
            />
          </Box>

          <Box width={"50%"}>
            <TimePicker
              label="Horário de Fim"
              control={control}
              name="endTime"
            />
          </Box>
        </Stack>

        <CheckboxGroup
          label="Unidades"
          sublabel="(Selecione onde este tipo estará disponível)"
          optional={false}
          options={unitsOptions}
          name="units"
          control={control}
          error={errors.units?.message}
          disabled={isLoadingUnits || isSubmitting}
        />

        <MealValidationList
          label={"Validações Necessárias"}
          options={mealValidations}
          name="validations"
          control={control}
          error={errors.validations?.message}
        />

        <Select
          name="status"
          control={control}
          label={"Status"}
          options={mockStatuses}
          error={errors.status?.message}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={resetAndClose}>
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}>
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
