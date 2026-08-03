"use client";

import { Stack, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditTerminalModalProps } from "./";
import { AlertIcon } from "@/components/Icons";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import Card from "@/components/Cards/Card";
import React from "react";
import { Button } from "@mui/material";
import { CATEGORIA_USUARIO_OPTIONS, TERMINAL_TIPO_OPTIONS } from "@/Interfaces/Terminal/terminal";

interface IUnidadeOption {
  id: number;
  nome: string;
}

interface ITipoRefeicaoOption {
  id: number;
  nome: string;
  unidade: { id: number; nome: string };
}

export default function EditTerminalModal({
  open,
  onClose,
  terminal,
  onSave,
}: EditTerminalModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTerminalSchemaFormData>({
    resolver: yupResolver(createTerminalSchema),
  });

  const [unidades, setUnidades] = React.useState<IUnidadeOption[]>([]);
  const [tiposRefeicao, setTiposRefeicao] = React.useState<ITipoRefeicaoOption[]>([]);

  const selectedUnidadeId = watch("unidadeId");

  const onSubmit = (data: CreateTerminalSchemaFormData) => {
    onSave(data);
    onClose();
  };

  React.useEffect(() => {
    if (!open) return;

    fetch("/api/unidades")
      .then((res) => res.json())
      .then((data) => setUnidades(data.results ?? data ?? []))
      .catch(() => setUnidades([]));

    fetch("/api/tipo-refeicao")
      .then((res) => res.json())
      .then((data) => setTiposRefeicao(data.results ?? data ?? []))
      .catch(() => setTiposRefeicao([]));
  }, [open]);

  React.useEffect(() => {
    if (!open || !terminal?.id || tiposRefeicao.length === 0) return;

    // O backend só retorna nomes das refeições permitidas — resolve os ids
    // pelo nome dentro da lista de tipos de refeição já carregada.
    const refeicoesIds = tiposRefeicao
      .filter((tr) => terminal.refeicoesPermitidas.includes(tr.nome))
      .map((tr) => String(tr.id));

    reset({
      nome: terminal.nome,
      unidadeId: String(terminal.unidadeId),
      tipo: terminal.tipo,
      refeicoesPermitidas: refeicoesIds,
      categoriasPermitidas: terminal.categoriasPermitidas,
    });
  }, [open, terminal, tiposRefeicao, reset]);

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

  return (
    <Modal open={open} onClose={onClose} title="Editar Terminal">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
          {refeicoesDaUnidade.length === 0 ? (
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
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
            }}
            variant="contained"
            type="submit"
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
