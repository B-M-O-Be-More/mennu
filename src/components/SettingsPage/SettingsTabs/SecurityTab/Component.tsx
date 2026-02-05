import { Controller, useForm } from "react-hook-form";
import { SecurityTabProps } from "./interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Stack, Switch, Typography } from "@mui/material";
import Input from "@/components/FormControl/Input/component";
import { SafetySettingsFormData, safetySettingsSchema } from "@/schemas/safetySettings";

const safetySettingsMock = {
  SessionTime: 30,
  MaxLoginAttempts: 5,
  TwoFactorAuth: true,
  ActivityLog: true,
}

export default function SecurityTab({ }: SecurityTabProps) {

  const { register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SafetySettingsFormData>({
    resolver: yupResolver(safetySettingsSchema),
    defaultValues:
      safetySettingsMock,
  });

  const onSubmit = (data: SafetySettingsFormData) => {
    console.log("Edit:", data);
  };

  return (
    <>
      <Typography variant="h6" fontWeight={'400'}>Configurações de Segurança</Typography>
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

          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
            <Box>
              <Typography fontWeight={'400'}>Autenticação de dois fatores</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={'400'}
              >
                Exigir 2FA para administradores
              </Typography>
            </Box>
            <Controller
              name="TwoFactorAuth"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Stack>

          <Divider sx={{ my: 1, borderColor: "grey.100" }} />

          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
            <Box>
              <Typography fontWeight={'400'}>Log de atividades</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={'400'}
              >
                Registrar todas as ações dos usuários
              </Typography>
            </Box>
            <Controller
              name="ActivityLog"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Stack>

        </Stack>
        <Button variant="contained" sx={{ width: "fit-content", borderRadius: 3, mt: 2 }} type="submit">Salvar Configurações</Button>
      </Box >
    </>
  );
}