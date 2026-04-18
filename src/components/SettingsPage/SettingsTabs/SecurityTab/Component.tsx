import { Controller, useForm } from "react-hook-form";
import { SecurityTabProps } from "./interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertColor, Box, Button, CircularProgress, Divider, Stack, Switch, Typography } from "@mui/material";
import Input from "@/components/FormControl/Input";
import { SafetySettingsFormData, safetySettingsSchema } from "@/schemas/safetySettings";
import React from "react";
import useFetch from "@/hooks/useFetch/hook";
import Toast from "@/components/Toast";

export default function SecurityTab({ }: SecurityTabProps) {
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor; }>({
    open: false, message: "", severity: "info",
  });

  const [requestGet, isLoadingGet] = useFetch<Record<string, unknown>>();
  const [requestPut, isLoadingPut] = useFetch<Record<string, unknown>>();

  const { register, handleSubmit, formState: { errors }, control, reset } =
    useForm<SafetySettingsFormData>({
      resolver: yupResolver(safetySettingsSchema),
      defaultValues: { SessionTime: 30, MaxLoginAttempts: 5, TwoFactorAuth: false, ActivityLog: false },
    });

  React.useEffect(() => {
    let isMounted = true;

    requestGet("/api/configuracoes/seguranca/", { method: "GET" })
      .then((resp) => {
        if (!isMounted) return;
        const data = resp as unknown as Record<string, unknown>;
        reset({
          SessionTime: (data.tempo_sessao_minutos as number) ?? 30,
          MaxLoginAttempts: (data.max_tentativas_login as number) ?? 5,
          TwoFactorAuth: (data.autenticacao_dois_fatores as boolean) ?? false,
          ActivityLog: (data.log_atividades as boolean) ?? false,
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setToast({ open: true, message: "Erro ao carregar configurações de segurança.", severity: "error" });
      });

    return () => { isMounted = false; };
  }, []);

  const onSubmit = async (data: SafetySettingsFormData) => {
    try {
      await requestPut("/api/configuracoes/seguranca/", {
        method: "PUT",
        body: {
          tempo_sessao_minutos: data.SessionTime,
          max_tentativas_login: data.MaxLoginAttempts,
          autenticacao_dois_fatores: data.TwoFactorAuth,
          log_atividades: data.ActivityLog,
        },
      });
      setToast({ open: true, message: "Configurações de segurança salvas!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Erro ao salvar configurações de segurança.", severity: "error" });
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight={'400'}>Configurações de Segurança</Typography>
      {isLoadingGet ? (
        <Stack alignItems="center" py={4}><CircularProgress /></Stack>
      ) : (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2} px={1}>
            <Input
              label="Tempo de Sessão (minutos)"
              placeholder="30"
              optional={false}
              register={register("SessionTime")}
              error={errors.SessionTime?.message}
            />

            <Input
              label="Máximo de tentativas de login"
              placeholder="5"
              optional={false}
              register={register("MaxLoginAttempts")}
              error={errors.MaxLoginAttempts?.message}
            />

            <Divider sx={{ borderColor: "grey.100" }} />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={'400'}>Autenticação de dois fatores</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={'400'}>
                  Exigir 2FA para administradores
                </Typography>
              </Box>
              <Controller
                name="TwoFactorAuth"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>

            <Divider sx={{ my: 1, borderColor: "grey.100" }} />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={'400'}>Log de atividades</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={'400'}>
                  Registrar todas as ações dos usuários
                </Typography>
              </Box>
              <Controller
                name="ActivityLog"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>
          </Stack>
          <Button
            variant="contained"
            sx={{ width: "fit-content", borderRadius: 3, mt: 2 }}
            type="submit"
            disabled={isLoadingPut}
          >
            {isLoadingPut ? <CircularProgress size={20} color="inherit" /> : "Salvar Configurações"}
          </Button>
        </Box>
      )}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </>
  );
}
