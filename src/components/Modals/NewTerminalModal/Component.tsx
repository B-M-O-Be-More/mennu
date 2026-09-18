"use client";

import { Stack, Typography, Box, Button, Checkbox, FormControlLabel, Alert } from "@mui/material";
import { NewTerminalModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import Card from "@/components/Cards/Card";
import { AlertIcon, CopyIcon } from "@/components/Icons";
import React from "react";
import {
  CATEGORIA_USUARIO_OPTIONS,
  ITerminalCreationResponseApi,
  TERMINAL_TIPO_OPTIONS,
} from "@/Interfaces/Terminal/terminal";
import { getApiMessage } from "@/utils/apiMessage";

interface IUnidadeOption {
  id: number;
  nome: string;
}

interface ITipoRefeicaoOption {
  id: number;
  nome: string;
  unidade: { id: number; nome: string };
}

type CreatedTerminalCredentials = {
  serviceToken: string;
  terminalUid: string;
};

type CopiedCredential = {
  token: boolean;
  uid: boolean;
};

function isTerminalCreationResponse(
  payload: unknown,
): payload is ITerminalCreationResponseApi {
  if (!payload || typeof payload !== "object") return false;

  const response = payload as {
    service_token?: unknown;
    terminal?: { uid?: unknown };
  };

  return (
    typeof response.service_token === "string" &&
    response.service_token.length > 0 &&
    typeof response.terminal?.uid === "string" &&
    response.terminal.uid.length > 0
  );
}

interface CredentialCopyBlockProps {
  label: string;
  value: string;
  copyLabel: string;
  copied: boolean;
  onCopy: () => void;
}

function CredentialCopyBlock({
  label,
  value,
  copyLabel,
  copied,
  onCopy,
}: CredentialCopyBlockProps) {
  return (
    <Stack gap={1}>
      <Typography variant="body2" fontWeight={500}>
        {label}
      </Typography>
      <Card sx={{ wordBreak: "break-all" }}>
        <Typography fontFamily="monospace" fontSize={14}>
          {value}
        </Typography>
      </Card>
      <Button
        variant="outlined"
        startIcon={<CopyIcon />}
        onClick={onCopy}
      >
        {copied ? "Copiado!" : copyLabel}
      </Button>
    </Stack>
  );
}

export default function NewTerminalModal({ open, onClose, onCreated }: NewTerminalModalProps) {
  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTerminalSchemaFormData>({
    resolver: yupResolver(createTerminalSchema),
    defaultValues: {
      nome: "",
      unidadeId: "",
      tipo: "",
      refeicoesPermitidas: [],
      categoriasPermitidas: [],
    },
  });

  const [unidades, setUnidades] = React.useState<IUnidadeOption[]>([]);
  const [tiposRefeicao, setTiposRefeicao] = React.useState<ITipoRefeicaoOption[]>([]);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] =
    React.useState<CreatedTerminalCredentials | null>(null);
  const [copied, setCopied] = React.useState<CopiedCredential>({
    token: false,
    uid: false,
  });

  const selectedUnidadeId = watch("unidadeId");

  React.useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    setCreatedCredentials(null);
    setCopied({ token: false, uid: false });
    reset({
      nome: "",
      unidadeId: "",
      tipo: "",
      refeicoesPermitidas: [],
      categoriasPermitidas: [],
    });

    fetch("/api/unidades")
      .then((res) => res.json())
      .then((data) => setUnidades(data.results ?? data ?? []))
      .catch(() => setUnidades([]));

    fetch("/api/tipo-refeicao")
      .then((res) => res.json())
      .then((data) => setTiposRefeicao(data.results ?? data ?? []))
      .catch(() => setTiposRefeicao([]));
  }, [open, reset]);

  const unidadeOptions = [
    { label: "Selecione uma unidade", value: "" },
    ...unidades.map((u) => ({ label: u.nome, value: String(u.id) })),
  ];

  const tipoOptions = [
    { label: "Selecione um tipo", value: "" },
    ...TERMINAL_TIPO_OPTIONS,
  ];

  const refeicoesDaUnidade = tiposRefeicao.filter(
    (tr) => String(tr.unidade?.id) === selectedUnidadeId,
  );

  const onSubmit = async (data: CreateTerminalSchemaFormData) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/terminais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          unidade_id: Number(data.unidadeId),
          tipo: data.tipo,
          refeicoes_permitidas: data.refeicoesPermitidas.map(Number),
          categorias_permitidas: data.categoriasPermitidas,
        }),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiMessage(result, "Erro ao cadastrar terminal"),
        );
      }

      if (!isTerminalCreationResponse(result)) {
        throw new Error(
          "O terminal foi cadastrado, mas a API não retornou o token e o UUID.",
        );
      }

      setCreatedCredentials({
        serviceToken: result.service_token,
        terminalUid: result.terminal.uid,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao cadastrar terminal");
    }
  };

  const handleCopy = (type: keyof CopiedCredential, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied((current) => ({ ...current, [type]: true }));
    });
  };

  const handleFinish = () => {
    onCreated?.();
    onClose();
  };

  if (createdCredentials) {
    return (
      <Modal open={open} onClose={handleFinish} title="Terminal cadastrado">
        <Stack gap={2}>
          <Alert severity="warning" icon={<AlertIcon />}>
            Copie o token de serviço e o UUID do terminal agora — eles não serão exibidos novamente. Configure-os no
            <code> appsettings.json</code> do serviço do terminal.
          </Alert>
          <CredentialCopyBlock
            label="Token de serviço"
            value={createdCredentials.serviceToken}
            copyLabel="Copiar Token"
            copied={copied.token}
            onCopy={() =>
              handleCopy("token", createdCredentials.serviceToken)
            }
          />
          <CredentialCopyBlock
            label="UUID do Terminal"
            value={createdCredentials.terminalUid}
            copyLabel="Copiar UUID"
            copied={copied.uid}
            onCopy={() =>
              handleCopy("uid", createdCredentials.terminalUid)
            }
          />
          <Button variant="contained" onClick={handleFinish}>
            Concluir
          </Button>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Terminal">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

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
            options={unidadeOptions}
            name="unidadeId"
            control={control}
            error={errors.unidadeId?.message}
          />

          <Select
            label="Tipo"
            options={tipoOptions}
            name="tipo"
            control={control}
            error={errors.tipo?.message}
          />
        </Stack>

        <Card>
          <Typography fontWeight={500} mb={1}>
            Refeições Permitidas
          </Typography>
          {!selectedUnidadeId ? (
            <Typography variant="body2" color="text.secondary">
              Selecione uma unidade para ver as refeições disponíveis.
            </Typography>
          ) : refeicoesDaUnidade.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhuma refeição cadastrada para essa unidade.
            </Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {refeicoesDaUnidade.map((ref) => (
                <FormControlLabel
                  key={ref.id}
                  control={
                    <Checkbox
                      value={String(ref.id)}
                      {...register("refeicoesPermitidas")}
                    />
                  }
                  label={ref.nome}
                />
              ))}
            </Stack>
          )}
        </Card>

        <Card sx={{ mt: 2 }}>
          <Typography fontWeight={500} mb={1}>
            Categorias Permitidas
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {CATEGORIA_USUARIO_OPTIONS.map((cat) => (
              <FormControlLabel
                key={cat.value}
                control={
                  <Checkbox
                    value={cat.value}
                    {...register("categoriasPermitidas")}
                  />
                }
                label={cat.label}
              />
            ))}
          </Stack>
        </Card>

        <Stack direction={"row"} border={"1px solid"} borderColor={"warning.light"} bgcolor={"warning.main"} borderRadius={2} p={2} gap={1}>
          <AlertIcon color="#E17100" />
          <Box>
            <Typography variant="body1" fontWeight={"400"} color="warning.contrastText" >
              Dependência de Unidade
            </Typography>
            <Typography variant="caption" color="warning.light" fontWeight={400}>
              Os terminais só funcionam se estiverem vinculados a uma unidade ativa. As políticas da unidade serão aplicadas automaticamente ao terminal.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              transition: "all 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            Cadastrar Terminal
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
