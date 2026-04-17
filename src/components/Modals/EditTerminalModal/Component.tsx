import React from "react";
import { Stack, Box, Button, Typography, Alert } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditTerminalModalProps } from "./";
import { AlertIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useLoading } from "@/hooks/useLoading/hook";

const TIPOS_TERMINAL = [
  { label: "Caixa", value: "CAIXA" },
  { label: "Totem", value: "TOTEM" },
  { label: "Entrada", value: "ENTRADA" },
  { label: "Validador", value: "VALIDADOR" },
];

export default function EditTerminalModal({
  open,
  onClose,
  terminal,
  onSave,
}: EditTerminalModalProps) {
  const { unitOptions } = useUnitFilterOptions();
  const { isLoading, executeAsyncFunction } = useLoading();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTerminalSchemaFormData>({
    resolver: yupResolver(createTerminalSchema),
  });

  React.useEffect(() => {
    if (open && terminal) {
      reset({
        nome: terminal.nome,
        tipo: terminal.tipo,
        unidade_id: terminal.unidadeId,
      });
      setSubmitError(null);
    }
  }, [open, terminal, reset]);

  const onSubmit = async (data: CreateTerminalSchemaFormData) => {
    setSubmitError(null);
    try {
      await executeAsyncFunction(async () => {
        const res = await fetch(`/api/terminais/${terminal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message ?? "Erro ao editar terminal");
        }
      });
      onSave();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao editar terminal");
    }
  };

  const unitSelectOptions = unitOptions.filter((o) => o.value !== "all");

  return (
    <Modal open={open} onClose={onClose} title="Editar Terminal">
      <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome do Terminal"
          placeholder="Ex. Terminal Principal"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Stack direction="row" spacing={2}>
          <Select
            label="Unidade"
            options={unitSelectOptions}
            register={register("unidade_id", { valueAsNumber: true })}
            error={errors.unidade_id?.message}
          />

          <Select
            label="Tipo"
            options={TIPOS_TERMINAL}
            register={register("tipo")}
            error={errors.tipo?.message}
          />
        </Stack>

        <Stack
          direction="row"
          border="1px solid"
          borderColor="warning.light"
          bgcolor="warning.main"
          borderRadius={2}
          p={2}
          gap={1}
        >
          <AlertIcon color="#E17100" />
          <Box>
            <Typography variant="body1" fontWeight={400} color="warning.contrastText">
              Dependência de Unidade
            </Typography>
            <Typography variant="caption" color="warning.light" fontWeight={400}>
              Os terminais só funcionam se estiverem vinculados a uma unidade ativa. As políticas
              da unidade serão aplicadas automaticamente ao terminal.
            </Typography>
          </Box>
        </Stack>

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1, fontSize: "1.2rem" }}
            variant="contained"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
