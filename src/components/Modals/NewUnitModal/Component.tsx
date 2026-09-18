"use client";

import { Alert, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { NewUnitModalProps } from ".";
import { CreateUnitSchemaFormData, createUnitSchema } from "@/schemas/unitSchema";
import { settingsService } from "@/services/settingsService";

const statusOptions = [{ label: "Ativo", value: "ativo" }, { label: "Inativo", value: "inativo" }];

export default function NewUnitModal({ open, onClose, onCreated }: NewUnitModalProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<CreateUnitSchemaFormData>({ resolver: yupResolver(createUnitSchema), defaultValues: { nome: "", endereco: "", responsavelId: "", ativo: "ativo" } });
  const [responsibles, setResponsibles] = React.useState<{ label: string; value: string }[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null); reset({ nome: "", endereco: "", responsavelId: "", ativo: "ativo" });
    settingsService.listResponsibleUsers()
      .then((users) => setResponsibles(users.map((user) => ({ label: user.nome, value: String(user.id) }))))
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Erro ao carregar responsáveis"));
  }, [open, reset]);

  const onSubmit = async (data: CreateUnitSchemaFormData) => {
    setError(null);
    try {
      const created = await settingsService.createUnit({ nome: data.nome, endereco: data.endereco, responsavel: Number(data.responsavelId) });
      if (data.ativo === "inativo" && created.ativo) await settingsService.toggleUnitStatus(created.id);
      await onCreated(); onClose();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Erro ao criar unidade"); }
  };

  return <Modal open={open} onClose={onClose} title="Nova Unidade"><Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
    {error && <Alert severity="error">{error}</Alert>}
    <Input label="Nome da Unidade" placeholder="Ex: Unidade Central" optional={false} register={register("nome")} error={errors.nome?.message} disabled={isSubmitting} />
    <Input label="Endereço" placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP" optional={false} register={register("endereco")} error={errors.endereco?.message} disabled={isSubmitting} />
    <Select label="Responsável" optional={false} options={[{ label: "Selecione um responsável", value: "" }, ...responsibles]} name="responsavelId" control={control} error={errors.responsavelId?.message} disabled={isSubmitting} />
    <Select label="Status" optional={false} options={statusOptions} name="ativo" control={control} error={errors.ativo?.message} disabled={isSubmitting} />
    <Stack direction="row" gap={2}><Button variant="outlined" sx={{ flex: 1 }} onClick={onClose} disabled={isSubmitting}>Cancelar</Button><Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Criar Unidade"}</Button></Stack>
  </Stack></Modal>;
}
