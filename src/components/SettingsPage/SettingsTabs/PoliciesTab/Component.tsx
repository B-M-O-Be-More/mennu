"use client";

import { Alert, Box, Button, Collapse, Divider, Grid, Stack, Switch, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Input from "@/components/FormControl/Input";
import { useUser } from "@/context/AuthContext";
import { PoliciesTabProps } from "./interface";
import { editAccessPolicySchema, EditAccessPolicySchemaFormData } from "@/schemas/policySchema";
import { UnitPolicyConfigApi } from "@/Interfaces/Settings/settings";
import { settingsService } from "@/services/settingsService";

function toFormValues(config: UnitPolicyConfigApi): EditAccessPolicySchemaFormData {
  return { permitirMultiplasRefeicoes: config.permitir_multiplas_refeicoes ?? true, horarioFlexivel: { permitido: config.horario_flexivel ?? false, horarioInicio: config.horario_flexivel_inicio?.slice(0, 5) ?? "07:00", horarioFim: config.horario_flexivel_fim?.slice(0, 5) ?? "19:00" }, reservaObrigatoria: config.reserva_obrigatoria ?? false };
}

export default function PoliciesTab({}: PoliciesTabProps) {
  const { activeContext } = useUser();
  const unitId = activeContext?.unidade_id;
  const [current, setCurrent] = React.useState<UnitPolicyConfigApi>({});
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(Boolean(unitId));
  const [isSaving, setIsSaving] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, watch, control, reset } = useForm<EditAccessPolicySchemaFormData>({
    resolver: yupResolver(editAccessPolicySchema),
    defaultValues: toFormValues({}),
  });
  const permitido = watch("horarioFlexivel.permitido");
  const horarioInicio = watch("horarioFlexivel.horarioInicio");
  const horarioFim = watch("horarioFlexivel.horarioFim");

  React.useEffect(() => {
    if (!unitId) { setIsLoading(false); return; }
    let active = true; setError(null); setIsLoading(true);
    settingsService.getUnitPolicies(unitId)
      .then((policies) => { if (active) { setCurrent(policies); reset(toFormValues(policies)); } })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : "Erro ao carregar políticas"); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [reset, unitId]);

  const onSubmit = async (data: EditAccessPolicySchemaFormData) => {
    if (!unitId) return;
    setError(null); setIsSaving(true);
    try {
      const updated = await settingsService.updateUnitPolicies(unitId, { ...current, permitir_multiplas_refeicoes: data.permitirMultiplasRefeicoes, horario_flexivel: data.horarioFlexivel.permitido, horario_flexivel_inicio: data.horarioFlexivel.permitido ? `${data.horarioFlexivel.horarioInicio}:00` : null, horario_flexivel_fim: data.horarioFlexivel.permitido ? `${data.horarioFlexivel.horarioFim}:00` : null, reserva_obrigatoria: data.reservaObrigatoria });
      setCurrent(updated); reset(toFormValues(updated));
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Erro ao salvar políticas"); }
    finally { setIsSaving(false); }
  };

  const disabled = !unitId || isLoading || isSaving;
  return <>
    <Typography variant="h6" fontWeight={400}>Políticas de Acesso</Typography>
    {!unitId && <Alert severity="warning" sx={{ mt: 2 }}>Selecione uma unidade para configurar suas políticas.</Alert>}
    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    <Box component="form" onSubmit={handleSubmit(onSubmit)}><Stack gap={2} px={1} mt={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Permitir múltiplas refeições por dia</Typography><Typography variant="body2" color="text.secondary">Usuários podem registrar mais de uma refeição</Typography></Box><Controller name="permitirMultiplasRefeicoes" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
      <Divider sx={{ my: 1, borderColor: "grey.100" }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Horário flexível</Typography><Typography variant="body2" color="text.secondary">Permitir acesso fora do horário padrão</Typography></Box><Controller name="horarioFlexivel.permitido" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
      <Collapse in={permitido}><Stack border="1px solid" borderColor="info.light" borderRadius={3} padding={2} gap={2} bgcolor="info.main"><Typography variant="body1" color="info.dark">Configurar Horário Flexível</Typography><Grid container spacing={2}><Grid size={{ xs: 12, md: 6 }}><Input label="Horário de Início" type="time" optional={false} register={register("horarioFlexivel.horarioInicio")} error={errors.horarioFlexivel?.horarioInicio?.message} disabled={disabled} /></Grid><Grid size={{ xs: 12, md: 6 }}><Input label="Horário de Fim" type="time" optional={false} register={register("horarioFlexivel.horarioFim")} error={errors.horarioFlexivel?.horarioFim?.message} disabled={disabled} /></Grid></Grid><Typography variant="body2" color="info.contrastText">O horário será permitido de <strong>{horarioInicio}</strong> até <strong>{horarioFim}</strong></Typography></Stack></Collapse>
      <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Reserva obrigatória</Typography><Typography variant="body2" color="text.secondary">Exigir reserva prévia para refeições</Typography></Box><Controller name="reservaObrigatoria" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
    </Stack><Button variant="contained" sx={{ width: "fit-content", borderRadius: 3, mt: 2 }} type="submit" disabled={disabled}>{isSaving ? "Salvando..." : "Salvar Políticas"}</Button></Box>
  </>;
}
