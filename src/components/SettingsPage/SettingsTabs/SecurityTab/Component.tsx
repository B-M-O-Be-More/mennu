"use client";

import { Alert, Box, Button, Divider, Stack, Switch, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { SecurityTabProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { SafetySettingsFormData, safetySettingsSchema } from "@/schemas/safetySettings";
import { SecuritySettingsApi } from "@/Interfaces/Settings/settings";
import { settingsService } from "@/services/settingsService";

function toFormValues(settings: SecuritySettingsApi): SafetySettingsFormData {
  return { SessionTime: settings.tempo_sessao_minutos, MaxLoginAttempts: settings.max_tentativas_login, TwoFactorAuth: settings.autenticacao_dois_fatores, ActivityLog: settings.log_atividades };
}

export default function SecurityTab({}: SecurityTabProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<SafetySettingsFormData>({
    resolver: yupResolver(safetySettingsSchema),
    defaultValues: { SessionTime: 30, MaxLoginAttempts: 5, TwoFactorAuth: false, ActivityLog: false },
  });

  React.useEffect(() => {
    let active = true;
    settingsService.getSecurity()
      .then((settings) => { if (active) reset(toFormValues(settings)); })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : "Erro ao carregar configurações de segurança"); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [reset]);

  const onSubmit = async (data: SafetySettingsFormData) => {
    setError(null); setIsSaving(true);
    try {
      const updated = await settingsService.updateSecurity({ tempo_sessao_minutos: data.SessionTime, max_tentativas_login: data.MaxLoginAttempts, autenticacao_dois_fatores: data.TwoFactorAuth, log_atividades: data.ActivityLog });
      reset(toFormValues(updated));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro ao salvar configurações de segurança");
    } finally { setIsSaving(false); }
  };

  const disabled = isLoading || isSaving;
  return (
    <>
      <Typography variant="h6" fontWeight={400}>Configurações de Segurança</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} px={1} mt={2}>
          <Input label="Tempo de Sessão (minutos)" placeholder="30" optional={false} register={register("SessionTime")} error={errors.SessionTime?.message} disabled={disabled} />
          <Input label="Máximo de tentativas de login" placeholder="5" optional={false} register={register("MaxLoginAttempts")} error={errors.MaxLoginAttempts?.message} disabled={disabled} />
          <Divider sx={{ borderColor: "grey.100" }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Autenticação de dois fatores</Typography><Typography variant="body2" color="text.secondary">Exigir 2FA para administradores</Typography></Box><Controller name="TwoFactorAuth" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
          <Divider sx={{ my: 1, borderColor: "grey.100" }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Log de atividades</Typography><Typography variant="body2" color="text.secondary">Registrar todas as ações dos usuários</Typography></Box><Controller name="ActivityLog" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
        </Stack>
        <Button variant="contained" sx={{ width: "fit-content", borderRadius: 3, mt: 2 }} type="submit" disabled={disabled}>{isSaving ? "Salvando..." : "Salvar Configurações"}</Button>
      </Box>
    </>
  );
}
