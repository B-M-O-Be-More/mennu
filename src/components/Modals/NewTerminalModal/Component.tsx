import React from "react";
import { Stack, Box, Button, Typography, Alert } from "@mui/material";
import { NewTerminalModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useLoading } from "@/hooks/useLoading/hook";
import { AlertIcon } from "@/components/Icons";

const TIPOS_TERMINAL = [
  { label: "Caixa", value: "CAIXA" },
  { label: "Totem", value: "TOTEM" },
  { label: "Entrada", value: "ENTRADA" },
  { label: "Validador", value: "VALIDADOR" },
];

export default function NewTerminalModal({ open, onClose, onSuccess }: NewTerminalModalProps) {
  const { unitOptions } = useUnitFilterOptions();
  const { isLoading, executeAsyncFunction } = useLoading();
  const [serviceToken, setServiceToken] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateTerminalSchemaFormData>({
    resolver: yupResolver(createTerminalSchema),
    defaultValues: { nome: "", tipo: "", unidade_id: undefined },
  });

  React.useEffect(() => {
    if (!open) {
      reset();
      setServiceToken(null);
      setSubmitError(null);
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateTerminalSchemaFormData) => {
    setSubmitError(null);
    try {
      await executeAsyncFunction(async () => {
        const res = await fetch("/api/terminais/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message ?? "Erro ao criar terminal");
        }
        const json = await res.json();
        const token = json?.data?.service_token ?? json?.service_token ?? null;
        setServiceToken(token);
      });
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao criar terminal");
    }
  };

  const unitSelectOptions = unitOptions.filter((o) => o.value !== "all");

  return (
    <Modal open={open} onClose={onClose} title="Novo Terminal">
      {serviceToken ? (
        <Stack gap={2}>
          <Alert severity="warning" icon={<AlertIcon color="#E17100" />}>
            <Typography fontWeight={500} mb={0.5}>
              Token de Serviço Gerado
            </Typography>
            <Typography variant="body2" mb={1}>
              Guarde este token agora — ele não será exibido novamente.
            </Typography>
            <Box
              component="code"
              sx={{
                display: "block",
                wordBreak: "break-all",
                bgcolor: "action.hover",
                borderRadius: 1,
                p: 1,
                fontSize: 12,
              }}
            >
              {serviceToken}
            </Box>
          </Alert>
          <Button variant="contained" onClick={onClose}>
            Fechar
          </Button>
        </Stack>
      ) : (
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
                transition: "all 0.2s ease-in-out",
                "&:hover": { color: "text.primary" },
              }}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Terminal"}
            </Button>
          </Stack>
        </Stack>
      )}
    </Modal>
  );
}
