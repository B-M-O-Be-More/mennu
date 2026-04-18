import { AlertColor, Box, Button, CircularProgress, Collapse, Divider, Grid, Stack, Switch, Typography } from "@mui/material";
import { PoliciesTabProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAccessPolicySchema, EditAccessPolicySchemaFormData } from "@/schemas/policySchema";
import React from "react";
import useFetch from "@/hooks/useFetch/hook";
import Toast from "@/components/Toast";

interface ApiPoliticas {
  permitir_multiplas_refeicoes?: boolean;
  horario_flexivel?: boolean;
  horario_flexivel_inicio?: string | null;
  horario_flexivel_fim?: string | null;
  reserva_obrigatoria?: boolean;
}

interface ApiUnidade {
  id: number;
}

interface PaginatedUnidades {
  results: ApiUnidade[];
}

function mapApiToForm(data: ApiPoliticas): EditAccessPolicySchemaFormData {
  return {
    permitirMultiplasRefeicoes: data.permitir_multiplas_refeicoes ?? false,
    horarioFlexivel: {
      permitido: data.horario_flexivel ?? false,
      horarioInicio: data.horario_flexivel_inicio?.slice(0, 5) ?? "",
      horarioFim: data.horario_flexivel_fim?.slice(0, 5) ?? "",
    },
    reservaObrigatoria: data.reserva_obrigatoria ?? false,
  };
}

function mapFormToApi(data: EditAccessPolicySchemaFormData): ApiPoliticas {
  return {
    permitir_multiplas_refeicoes: data.permitirMultiplasRefeicoes,
    horario_flexivel: data.horarioFlexivel.permitido,
    horario_flexivel_inicio: data.horarioFlexivel.permitido ? data.horarioFlexivel.horarioInicio : null,
    horario_flexivel_fim: data.horarioFlexivel.permitido ? data.horarioFlexivel.horarioFim : null,
    reserva_obrigatoria: data.reservaObrigatoria,
  };
}

export default function PoliciesTab({ }: PoliciesTabProps) {
  const [unidadeId, setUnidadeId] = React.useState<number | null>(null);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: "", severity: "info",
  });

  const [requestUnidades] = useFetch<PaginatedUnidades>();
  const [requestGet, isLoadingGet] = useFetch<ApiPoliticas>();
  const [requestPut, isLoadingPut] = useFetch<ApiPoliticas>();

  const { register, handleSubmit, formState: { errors }, watch, control, reset } =
    useForm<EditAccessPolicySchemaFormData>({
      resolver: yupResolver(editAccessPolicySchema),
      defaultValues: {
        permitirMultiplasRefeicoes: false,
        horarioFlexivel: { permitido: false, horarioInicio: "", horarioFim: "" },
        reservaObrigatoria: false,
      },
    });

  const permitido = watch("horarioFlexivel.permitido");
  const horarioInicio = watch("horarioFlexivel.horarioInicio");
  const horarioFim = watch("horarioFlexivel.horarioFim");

  React.useEffect(() => {
    let isMounted = true;

    requestUnidades("/api/unidades/", { method: "GET" })
      .then((resp) => {
        const raw = resp as unknown as PaginatedUnidades;
        const firstId = raw.results?.[0]?.id;
        if (!firstId || !isMounted) return;
        setUnidadeId(firstId);

        return requestGet(`/api/unidades/${firstId}/politicas`, { method: "GET" })
          .then((pol) => {
            if (!isMounted) return;
            reset(mapApiToForm(pol as unknown as ApiPoliticas));
          });
      })
      .catch(() => {
        if (!isMounted) return;
        setToast({ open: true, message: "Erro ao carregar políticas.", severity: "error" });
      });

    return () => { isMounted = false; };
  }, []);

  const onSubmit = async (data: EditAccessPolicySchemaFormData) => {
    if (!unidadeId) return;
    try {
      await requestPut(`/api/unidades/${unidadeId}/politicas`, {
        method: "PUT",
        body: mapFormToApi(data) as unknown as Record<string, unknown>,
      });
      setToast({ open: true, message: "Políticas salvas com sucesso!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Erro ao salvar políticas.", severity: "error" });
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight={'400'}>Políticas de Acesso</Typography>
      {isLoadingGet ? (
        <Stack alignItems="center" py={4}><CircularProgress /></Stack>
      ) : (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2} px={1}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={'400'}>Permitir múltiplas refeições por dia</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={'400'}>
                  Usuários podem registrar mais de uma refeição
                </Typography>
              </Box>
              <Controller
                name="permitirMultiplasRefeicoes"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>

            <Divider sx={{ my: 1, borderColor: "grey.100" }} />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={'400'}>Horário flexível</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={'400'}>
                  Permitir acesso fora do horário padrão
                </Typography>
              </Box>
              <Controller
                name="horarioFlexivel.permitido"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>

            <Collapse in={permitido} timeout={600} easing="ease-in-out">
              <Stack border="1px solid" borderColor="info.light" borderRadius={3} padding={2} gap={2} bgcolor="info.main">
                <Typography variant="body1" color="info.dark">Configurar Horário Flexível</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Horário de Início"
                      type="time"
                      placeholder="07:00"
                      optional={false}
                      register={register("horarioFlexivel.horarioInicio")}
                      error={errors.horarioFlexivel?.horarioInicio?.message}
                      sx={{ bgcolor: "background.paper", "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 14, "& fieldset": { borderColor: "info.light" } } }}
                      labelSx={{ color: "info.contrastText" }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Input
                      label="Horário de Fim"
                      placeholder="19:00"
                      optional={false}
                      register={register("horarioFlexivel.horarioFim")}
                      error={errors.horarioFlexivel?.horarioFim?.message}
                      sx={{ bgcolor: "background.paper", "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 14, "& fieldset": { borderColor: "info.light" } } }}
                      labelSx={{ color: "info.contrastText" }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2" color="info.contrastText">
                  O horário será permitido de <strong>{horarioInicio}</strong> até <strong>{horarioFim}</strong>
                </Typography>
              </Stack>
            </Collapse>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={'400'}>Reserva obrigatória</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={'400'}>
                  Exigir reserva prévia para refeições
                </Typography>
              </Box>
              <Controller
                name="reservaObrigatoria"
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
            disabled={isLoadingPut || !unidadeId}
          >
            {isLoadingPut ? <CircularProgress size={20} color="inherit" /> : "Salvar Políticas"}
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
