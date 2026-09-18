import { Stack, Button, Alert } from "@mui/material";
import { AddInsumoModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCardapioInsumoSchema, AddCardapioInsumoSchemaFormData } from "@/schemas/cardapioInsumoSchema";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import React from "react";

export default function AddInsumoModal({ open, onClose, cardapioId, onAdded }: AddInsumoModalProps) {
  const { insumoOptions } = useInsumoOptions();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<AddCardapioInsumoSchemaFormData>({
    resolver: yupResolver(addCardapioInsumoSchema),
    defaultValues: {
      insumoId: "",
      quantidadePrevista: 0,
    },
  });

  const onSubmit = async (data: AddCardapioInsumoSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/cardapio/${cardapioId}/insumo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insumo_id: Number(data.insumoId),
          quantidade_prevista: data.quantidadePrevista,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao adicionar insumo" }));
        throw new Error(errData.detail ?? "Erro ao adicionar insumo");
      }

      reset();
      onAdded();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao adicionar insumo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Adicionar Insumo">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Select
          label="Insumo"
          optional={false}
          options={[{ label: "Selecione um insumo", value: "" }, ...insumoOptions]}
          name="insumoId"
          control={control}
          error={errors.insumoId?.message}
        />

        <Input
          label="Quantidade Prevista"
          placeholder="0"
          type="number"
          optional={false}
          register={register("quantidadePrevista")}
          error={errors.quantidadePrevista?.message}
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar Insumo"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
