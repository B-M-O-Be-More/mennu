import { Stack, Button, Alert } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import DatePicker from "@/components/FormControl/DatePicker";
import { EditMenuModalProps } from "./";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editMenuSchema, EditMenuSchemaFormData } from "@/schemas/menuSchema";
import React from "react";
import dayjs, { Dayjs } from "dayjs";

export default function EditMenuModal({
  open,
  onClose,
  menu,
  onSaved,
}: EditMenuModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditMenuSchemaFormData>({
    resolver: yupResolver(editMenuSchema),
    defaultValues: {
      dataRefeicao: dayjs(menu.dataRefeicao),
      numeroPrevistoRefeicoes: menu.numeroPrevistoRefeicoes,
      observacao: menu.observacoes ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        dataRefeicao: dayjs(menu.dataRefeicao),
        numeroPrevistoRefeicoes: menu.numeroPrevistoRefeicoes,
        observacao: menu.observacoes ?? "",
      });
      setSubmitError(null);
    }
  }, [open, menu, reset]);

  const onSubmit = async (data: EditMenuSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/cardapio/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_refeicao: (data.dataRefeicao as Dayjs).format("YYYY-MM-DD"),
          numero_previsto_refeicoes: data.numeroPrevistoRefeicoes,
          observacoes: data.observacao || null,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao salvar cardápio" }));
        throw new Error(errData.detail ?? "Erro ao salvar cardápio");
      }

      onSaved();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao salvar cardápio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Cardápio">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <DatePicker label="Data da Refeição" name="dataRefeicao" control={control} />

        <Input
          label="Refeições Previstas"
          placeholder="0"
          type="number"
          register={register("numeroPrevistoRefeicoes")}
          error={errors.numeroPrevistoRefeicoes?.message}
        />

        <Input
          label="Observações"
          placeholder="Ex: Opção vegetariana disponível"
          multiline
          register={register("observacao")}
          error={errors.observacao?.message}
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
