import { Stack, Button, Alert } from "@mui/material";
import { AddPratoModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addPratoSchema,
  AddPratoSchemaFormData,
  TIPO_PRATO_OPTIONS,
  RESTRICAO_ALIMENTAR_OPTIONS,
} from "@/schemas/pratoSchema";
import React from "react";

export default function AddPratoModal({ open, onClose, cardapioId, onAdded }: AddPratoModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<AddPratoSchemaFormData>({
    resolver: yupResolver(addPratoSchema),
    defaultValues: {
      tipoPrato: "",
      nome: "",
      descricao: "",
      restricoes: [],
    },
  });

  const onSubmit = async (data: AddPratoSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/cardapio/${cardapioId}/prato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_prato: data.tipoPrato,
          nome: data.nome,
          descricao: data.descricao || undefined,
          restricoes: data.restricoes,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao adicionar prato" }));
        throw new Error(errData.detail ?? "Erro ao adicionar prato");
      }

      reset();
      onAdded();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao adicionar prato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Adicionar Prato">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Select
          label="Tipo de Prato"
          optional={false}
          options={[{ label: "Selecione o tipo", value: "" }, ...TIPO_PRATO_OPTIONS]}
          name="tipoPrato"
          control={control}
          error={errors.tipoPrato?.message}
        />

        <Input
          label="Nome"
          placeholder="Ex: Arroz Branco"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Input
          label="Descrição"
          placeholder="Ex: Opção vegetariana disponível"
          multiline
          register={register("descricao")}
          error={errors.descricao?.message}
        />

        <CheckboxGroup
          label="Restrições Alimentares"
          options={RESTRICAO_ALIMENTAR_OPTIONS}
          name="restricoes"
          control={control}
          error={errors.restricoes?.message}
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
            {isSubmitting ? "Adicionando..." : "Adicionar Prato"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
