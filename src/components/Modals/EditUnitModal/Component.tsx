"use client";

import { Alert, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditUnitModalProps } from ".";
import { CreateUnitSchemaFormData, createUnitSchema } from "@/schemas/unitSchema";
import { settingsService } from "@/services/settingsService";

const statusOptions = [{ label: "Ativo", value: "ativo" }, { label: "Inativo", value: "inativo" }];

export default function EditUnitModal({ open, onClose, unitItem, onSaved }: EditUnitModalProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<CreateUnitSchemaFormData>({ resolver: yupResolver(createUnitSchema) });
  const [responsibles, setResponsibles] = React.useState<{ label: string; value: string }[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !unitItem) return;
    setError(null);
    reset({ nome: unitItem.nome, endereco: unitItem.endereco === "-" ? "" : unitItem.endereco, responsavelId: unitItem.responsavelId ? String(unitItem.responsavelId) : "", ativo: unitItem.status });
    settingsService.listResponsibleUsers().then((users) => setResponsibles(users.map((user) => ({ label: user.nome, value: String(user.id) })))).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Erro ao carregar responsáveis"));
  }, [open, reset, unitItem]);

  const onSubmit = async (data: CreateUnitSchemaFormData) => {
    if (!unitItem) return;
    setError(null);
    try {
      await settingsService.updateUnit(unitItem.id, { nome: data.nome, endereco: data.endereco, responsavel: Number(data.responsavelId), ativo: data.ativo === "ativo" });
      await onSaved(); onClose();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Erro ao salvar unidade"); }
  };

  return <Modal open={open} onClose={onClose} title="Editar Unidade"><Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
    {error && <Alert severity="error">{error}</Alert>}
    <Input label="Nome da Unidade" placeholder="Ex. Unidade Central" optional={false} register={register("nome")} error={errors.nome?.message} disabled={isSubmitting} />
    <Input label="Endereço" placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP" optional={false} register={register("endereco")} error={errors.endereco?.message} disabled={isSubmitting} />
    <Select label="Responsável" optional={false} options={[{ label: "Selecione um responsável", value: "" }, ...responsibles]} name="responsavelId" control={control} error={errors.responsavelId?.message} disabled={isSubmitting} />
    <Select label="Status" optional={false} options={statusOptions} name="ativo" control={control} error={errors.ativo?.message} disabled={isSubmitting} />
    <Stack direction="row" gap={2}><Button variant="outlined" sx={{ flex: 1 }} onClick={onClose} disabled={isSubmitting}>Cancelar</Button><Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar Alterações"}</Button></Stack>
  </Stack></Modal>;
}
