import {
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { UnitPoliciesModalProps } from "./";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { unitPoliciesSchema, UnitPoliciesFormData } from "@/schemas/unitSchema";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { CircledCheckIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import React from "react";
import useFetch from "@/hooks/useFetch/hook";
import Toast from "@/components/Toast";

interface PoliticaRefeicao {
  tipo_refeicao: string;
  horario_inicio: string;
  horario_fim: string;
  limite_diario: number;
  limite_semanal: number;
  limite_mensal: number;
  tempo_minimo_entre_refeicoes: number;
}

interface PoliticasConfig {
  permitir_multiplas_refeicoes?: boolean;
  horario_flexivel?: boolean;
  horario_flexivel_inicio?: string;
  horario_flexivel_fim?: string;
  reserva_obrigatoria?: boolean;
  limite_diario_global?: number;
  limite_semanal_global?: number;
  limite_mensal_global?: number;
  intervalo_minimo?: number;
  politicas?: PoliticaRefeicao[];
}

function mapApiToForm(data: PoliticasConfig): UnitPoliciesFormData {
  const politicas = data.politicas ?? [];
  return {
    refeicoes: politicas.map((p) => ({
      nome: p.tipo_refeicao,
      inicio: p.horario_inicio?.slice(0, 5) ?? "",
      fim: p.horario_fim?.slice(0, 5) ?? "",
      limiteDiario: p.limite_diario ?? 0,
      limiteSemanal: p.limite_semanal ?? 0,
      limiteMensal: p.limite_mensal ?? 0,
    })),
    limiteAtivo: politicas.some((p) => (p.limite_diario ?? 0) > 0),
  };
}

function mapFormToApi(data: UnitPoliciesFormData): PoliticasConfig {
  return {
    politicas: (data.refeicoes ?? []).map((r) => ({
      tipo_refeicao: r.nome,
      horario_inicio: r.inicio,
      horario_fim: r.fim,
      limite_diario: data.limiteAtivo ? (r.limiteDiario ?? 0) : 0,
      limite_semanal: data.limiteAtivo ? (r.limiteSemanal ?? 0) : 0,
      limite_mensal: data.limiteAtivo ? (r.limiteMensal ?? 0) : 0,
      tempo_minimo_entre_refeicoes: 0,
    })),
  };
}

const EMPTY_REFEICAO = { nome: "", inicio: "", fim: "", limiteDiario: 0, limiteSemanal: 0, limiteMensal: 0 };

export default function UnitPoliciesModal({
  open,
  onClose,
  unitItem,
  onSave,
}: UnitPoliciesModalProps) {
  const theme = useTheme();
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: "", severity: "info",
  });

  const [requestGet, isLoadingGet] = useFetch<PoliticasConfig>();
  const [requestPut, isLoadingPut] = useFetch<PoliticasConfig>();

  const { register, handleSubmit, formState: { errors }, reset, control, watch } =
    useForm<UnitPoliciesFormData>({
      resolver: yupResolver(unitPoliciesSchema),
      defaultValues: { refeicoes: [], limiteAtivo: false },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "refeicoes" });
  const limiteAtivo = watch("limiteAtivo");

  React.useEffect(() => {
    if (!open) return;

    if (unitItem?.id) {
      requestGet(`/api/unidades/${unitItem.id}/politicas`, { method: "GET" })
        .then((resp) => reset(mapApiToForm(resp as unknown as PoliticasConfig)))
        .catch(() => setToast({ open: true, message: "Erro ao carregar políticas da unidade.", severity: "error" }));
    } else {
      reset({ refeicoes: [], limiteAtivo: false });
    }
  }, [open, unitItem?.id]);

  const onSubmit = async (data: UnitPoliciesFormData) => {
    if (unitItem?.id) {
      try {
        await requestPut(`/api/unidades/${unitItem.id}/politicas`, {
          method: "PUT",
          body: mapFormToApi(data) as unknown as Record<string, unknown>,
        });
        setToast({ open: true, message: "Políticas salvas com sucesso!", severity: "success" });
        onSave({ ...unitItem });
        onClose();
      } catch {
        setToast({ open: true, message: "Erro ao salvar políticas.", severity: "error" });
      }
    } else if (unitItem) {
      onSave({ ...unitItem });
      onClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Políticas da Unidade"
        subtitle={unitItem?.nome}
        dialogSx={{ maxWidth: "md" }}
      >
        {isLoadingGet ? (
          <Stack alignItems="center" py={4}><CircularProgress /></Stack>
        ) : (
          <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={"400"}>Horários por Refeição</Typography>
                <IconButton
                  size="small"
                  onClick={() => append(EMPTY_REFEICAO)}
                  sx={{ bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 2, "&:hover": { bgcolor: "primary.dark" } }}
                >
                  <PlusIcon width={18} height={18} />
                </IconButton>
              </Stack>

              {fields.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                  Clique em "+" para adicionar uma refeição
                </Typography>
              )}

              {fields.map((field, index) => (
                <Stack
                  key={field.id}
                  direction="row"
                  spacing={1.5}
                  bgcolor="#F9FAFB"
                  border="1px solid"
                  borderColor="divider"
                  padding={2}
                  borderRadius={2}
                  alignItems="flex-start"
                >
                  <Box flex={1.5}>
                    <Input
                      label="Nome"
                      placeholder="Ex: Café da Manhã"
                      register={register(`refeicoes.${index}.nome`)}
                      error={errors.refeicoes?.[index]?.nome?.message}
                    />
                  </Box>
                  <Box flex={1}>
                    <Input
                      label="Início"
                      placeholder="07:00"
                      register={register(`refeicoes.${index}.inicio`)}
                      error={errors.refeicoes?.[index]?.inicio?.message}
                    />
                  </Box>
                  <Box flex={1}>
                    <Input
                      label="Fim"
                      placeholder="09:00"
                      register={register(`refeicoes.${index}.fim`)}
                      error={errors.refeicoes?.[index]?.fim?.message}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    sx={{ mt: 3.5, color: "error.contrastText", border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                  >
                    <TrashIcon width={18} height={18} />
                  </IconButton>
                </Stack>
              ))}
            </Stack>

            <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={"400"}>Limites de Consumo</Typography>
                <Controller
                  name="limiteAtivo"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )}
                />
              </Stack>

              <Collapse in={limiteAtivo} timeout={400}>
                <Stack gap={2}>
                  {fields.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Adicione refeições acima para configurar os limites.
                    </Typography>
                  )}
                  {fields.map((field, index) => {
                    const nome = watch(`refeicoes.${index}.nome`) || `Refeição ${index + 1}`;
                    return (
                      <Stack
                        key={field.id}
                        gap={1.5}
                        border="1px solid"
                        borderColor="divider"
                        padding={2}
                        borderRadius={2}
                      >
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {nome}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Input
                            label={`Limite por ${nome}`}
                            placeholder="0"
                            register={register(`refeicoes.${index}.limiteDiario`, { valueAsNumber: true })}
                            error={errors.refeicoes?.[index]?.limiteDiario?.message}
                          />
                          <Input
                            label="Limite Semanal"
                            placeholder="0"
                            register={register(`refeicoes.${index}.limiteSemanal`, { valueAsNumber: true })}
                            error={errors.refeicoes?.[index]?.limiteSemanal?.message}
                          />
                          <Input
                            label="Limite Mensal"
                            placeholder="0"
                            register={register(`refeicoes.${index}.limiteMensal`, { valueAsNumber: true })}
                            error={errors.refeicoes?.[index]?.limiteMensal?.message}
                          />
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              </Collapse>
            </Stack>

            <ClosableAlertBox
              severity="info"
              icon={<CircledCheckIcon color={theme.palette.info.contrastText} />}
              title="Propagação Automática"
              description="Todas as políticas definidas aqui serão automaticamente aplicadas aos terminais vinculados a esta unidade. Os terminais receberão as atualizações na próxima sincronização."
            />

            <Stack direction="row" gap={2}>
              <Button
                variant="outlined"
                sx={{ flex: 1, fontSize: "1.2rem", border: "1px solid", borderColor: "divider", color: "text.secondary" }}
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                sx={{ flex: 1, fontSize: "1.2rem" }}
                variant="contained"
                type="submit"
                disabled={isLoadingPut}
              >
                {isLoadingPut ? <CircularProgress size={20} color="inherit" /> : "Salvar Alterações"}
              </Button>
            </Stack>
          </Stack>
        )}
      </Modal>
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
