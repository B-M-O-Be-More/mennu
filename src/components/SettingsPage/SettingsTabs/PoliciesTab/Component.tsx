import { Box, Button, Collapse, Divider, Grid, Stack, Switch, Typography } from "@mui/material";
import { PoliciesTabProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editIAccessPolicySchema, EditIAccessPolicySchemaFormData } from "@/schemas/policySchema";

const policyMock = {
  permitirMultiplasRefeicoes: true,
  horarioFlexivel: {
    permitido: true,
    horarioInicio: "07:00",
    horarioFim: "19:00",
  },
  reservaObrigatoria: false,
}

export default function PoliciesTab({ }: PoliciesTabProps) {

  const { register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<EditIAccessPolicySchemaFormData>({
    resolver: yupResolver(editIAccessPolicySchema),
    defaultValues:
      policyMock,
  });

  const permitido = watch("horarioFlexivel.permitido");
  const horarioInicio = watch("horarioFlexivel.horarioInicio");
  const horarioFim = watch("horarioFlexivel.horarioFim");

  const onSubmit = (data: EditIAccessPolicySchemaFormData) => {
    console.log("Edit:", data);
  };

  return (
    <>
      <Typography variant="h6" fontWeight={'400'}>Políticas de Acesso</Typography>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} px={1}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
            <Box>
              <Typography fontWeight={'400'}>Permitir múltiplas refeições por dia</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={'400'}
              >
                Usuários podem registrar mais de uma refeição
              </Typography>
            </Box>
            <Controller
              name="permitirMultiplasRefeicoes"
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
              <Typography fontWeight={'400'}>Horário flexível</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={'400'}
              >
                Permitir acesso fora do horário padrão
              </Typography>
            </Box>
            <Controller
              name="horarioFlexivel.permitido"
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

          <Collapse
            in={permitido}
            timeout={600}
            easing="ease-in-out"
          >
            <Stack
              border="1px solid"
              borderColor={`info.light`}
              borderRadius={3}
              padding={2}
              gap={2}
              bgcolor={`info.main`}
            >

              <Typography variant="body1" color={`info.dark`}>
                Configurar Horário Flexível
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Input
                    label="Horário de Início"
                    placeholder="07:00"
                    optional={false}
                    register={register("horarioFlexivel.horarioInicio")}
                    error={errors.horarioFlexivel?.horarioInicio?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Input
                    label="Horário de Fim"
                    placeholder="19:00"
                    optional={false}
                    register={register("horarioFlexivel.horarioFim")}
                    error={errors.horarioFlexivel?.horarioFim?.message}
                  />
                </Grid>
              </Grid>


              <Typography variant="body2" color={`info.contrastText`}>
                O horário será permitido de <strong>{horarioInicio}</strong> até <strong>{horarioFim}</strong>
              </Typography>
            </Stack>
          </Collapse>

          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
            <Box>
              <Typography fontWeight={'400'}>Reserva obrigatória</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={'400'}
              >
                Exigir reserva prévia para refeições
              </Typography>
            </Box>
            <Controller
              name="reservaObrigatoria"
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
        <Button variant="contained" sx={{ width: "fit-content", borderRadius: 3, mt: 2 }} type="submit">Salvar Políticas</Button>
      </Box >
    </>
  );
}