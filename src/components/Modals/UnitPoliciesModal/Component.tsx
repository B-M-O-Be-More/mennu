"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { UnitPoliciesModalProps } from ".";
import { CreatePolicySchemaFormData, createPolicySchema } from "@/schemas/unitSchema";
import { mergeUnitPoliciesForm, settingsService, toUnitPoliciesForm } from "@/services/settingsService";
import { UnitPolicyConfigApi } from "@/Interfaces/Settings/settings";

const meals = [
  { label: "Café da Manhã", field: "cafeManha" as const },
  { label: "Almoço", field: "almoco" as const },
  { label: "Jantar", field: "jantar" as const },
];

export default function UnitPoliciesModal({ open, onClose, unitItem, onSaved }: UnitPoliciesModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreatePolicySchemaFormData>({ resolver: yupResolver(createPolicySchema) });
  const [current, setCurrent] = React.useState<UnitPolicyConfigApi>({});
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open || !unitItem) return;
    let active = true; setIsLoading(true); setError(null);
    settingsService.getUnitPolicies(unitItem.id)
      .then((policies) => { if (active) { setCurrent(policies); reset(toUnitPoliciesForm(policies)); } })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : "Erro ao carregar políticas"); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [open, reset, unitItem]);

  const onSubmit = async (data: CreatePolicySchemaFormData) => {
    if (!unitItem) return;
    setError(null);
    try {
      await settingsService.updateUnitPolicies(unitItem.id, mergeUnitPoliciesForm(current, data));
      await onSaved(); onClose();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Erro ao salvar políticas"); }
  };

  const disabled = isLoading || isSubmitting;
  return <Modal open={open} onClose={onClose} title="Políticas da Unidade" subtitle={unitItem?.nome} dialogSx={{ maxWidth: "md" }}><Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
    {error && <Alert severity="error">{error}</Alert>}
    <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}><Typography variant="h6" fontWeight={400}>Horários por Refeição</Typography>
      {meals.map((meal) => <Stack key={meal.field} direction="row" spacing={2} bgcolor="#F9FAFB" padding={2} borderRadius={2} alignItems="center"><Typography whiteSpace="nowrap">{meal.label}</Typography><Stack direction="row" gap={2} width="100%"><Input label="Início" placeholder="HH:mm" register={register(`horarios.${meal.field}.inicio`)} error={errors.horarios?.[meal.field]?.inicio?.message} disabled={disabled} /><Input label="Fim" placeholder="HH:mm" register={register(`horarios.${meal.field}.fim`)} error={errors.horarios?.[meal.field]?.fim?.message} disabled={disabled} /></Stack></Stack>)}
    </Stack>
    <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}><Typography variant="h6" fontWeight={400}>Limites de Consumo</Typography><Stack direction="row" spacing={2}><Input label="Limite Diário" placeholder="0" register={register("limites.diario")} error={errors.limites?.diario?.message} disabled={disabled} /><Input label="Limite Semanal" placeholder="0" register={register("limites.semanal")} error={errors.limites?.semanal?.message} disabled={disabled} /><Input label="Limite Mensal" placeholder="0" register={register("limites.mensal")} error={errors.limites?.mensal?.message} disabled={disabled} /></Stack></Stack>
    <Stack direction="row" gap={2}><Button variant="outlined" sx={{ flex: 1 }} onClick={onClose} disabled={disabled}>Cancelar</Button><Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={disabled}>{isSubmitting ? "Salvando..." : "Salvar Alterações"}</Button></Stack>
  </Stack></Modal>;
}
