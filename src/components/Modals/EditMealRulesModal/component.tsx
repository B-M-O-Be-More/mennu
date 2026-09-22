import {
  Alert,
  Box,
  Button,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import Modal from "../Modal";
import { EditMealRulesModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { CircledCheckIcon, ErrorOutlineIcon } from "@/components/Icons";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealRuleInput, mealRuleSchema } from "@/schemas/mealRulesSchema";
import React from "react";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";
import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";
import { formatMealSchedule } from "@/utils/mealRulesUtils";

function toFormValues(rule: MealRuleResponse): MealRuleInput {
  return {
    dailyLimit: rule.dailyLimit,
    weeklyLimit: rule.weeklyLimit,
    monthlyLimit: rule.monthlyLimit,
    minInterval: rule.minInterval,
    isTimeRestricted: rule.isTimeRestricted,
  };
}

export function EditMealRulesModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: EditMealRulesModalProps) {
  const theme = useTheme();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<MealRuleInput>({
    resolver: yupResolver(mealRuleSchema),
    defaultValues: toFormValues(initialData),
  });

  React.useEffect(() => {
    if (isOpen && initialData) {
      setError(null);
      reset(toFormValues(initialData));
    }
  }, [isOpen, initialData, reset]);

  async function handleEdit(data: MealRuleInput) {
    setError(null);
    setIsSaving(true);

    try {
      await onSave?.(data);
      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Erro ao salvar as regras de consumo",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (isSaving) return;
    onClose();
  }

  const isTimeRestricted = useWatch({
    control: control,
    name: "isTimeRestricted",
  });

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={"Regras de Consumo"}
      subtitle={`${initialData.mealTypeLabel} · ${formatMealSchedule(initialData.startTime, initialData.endTime)} · ${initialData.unit}`}>
      <Stack component={"form"} onSubmit={handleSubmit(handleEdit)} gap={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
          <Box
            sx={{
              maxWidth: { xs: "32%" },
              minWidth: { xs: "100%", sm: "32%" },
            }}>
            <Input
              label="Limite diário"
              placeholder="3"
              type="number"
              disabled={isSaving}
              description="Máximo de refeições por dia"
              register={register("dailyLimit", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              error={errors.dailyLimit?.message}
            />
          </Box>

          <Box
            sx={{
              maxWidth: { sm: "32%" },
              minWidth: { xs: "100%", sm: "32%" },
            }}>
            <Input
              label="Limite Semanal"
              placeholder="15"
              type="number"
              disabled={isSaving}
              description="Máximo de refeições por semana"
              register={register("weeklyLimit", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              error={errors.weeklyLimit?.message}
            />
          </Box>

          <Box
            sx={{
              maxWidth: { sm: "32%" },
              minWidth: { xs: "100%", sm: "32%" },
            }}>
            <Input
              label="Limite Mensal"
              placeholder="60"
              type="number"
              disabled={isSaving}
              description="Máximo de refeições por mês"
              register={register("monthlyLimit", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              error={errors.monthlyLimit?.message}
            />
          </Box>
        </Stack>

        <Box>
          <Input
            label="Intervalo Mínimo (minutos)"
            placeholder="240"
            type="number"
            disabled={isSaving}
            description="Tempo mínimo entre refeições (0 = sem restrição)"
            register={register("minInterval", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            error={errors.minInterval?.message}
          />
        </Box>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          border={"1px solid"}
          borderColor={"divider"}
          borderRadius={3}
          padding={2}>
          <Stack direction={"row"} gap={2} alignItems={"center"}>
            <ErrorOutlineIcon color={theme.palette.error.contrastText} />
            <Box component={"span"}>
              <Typography>Bloquear Fora do Horário</Typography>
              <Typography color="text.secondary" variant="body2">
                Impedir acesso fora dos horários configurados em toda a unidade
              </Typography>
            </Box>
          </Stack>
          <Switch
            checked={!!isTimeRestricted}
            disabled={isSaving}
            onChange={(e) => setValue("isTimeRestricted", e.target.checked)}
          />
        </Stack>

        <ClosableAlertBox
          severity="info"
          icon={<CircledCheckIcon color={theme.palette.info.contrastText} />}
          title="Propagação Automática"
          description="Essas regras serão aplicadas automaticamente a todos os terminais vinculados a esta unidade. Os terminais receberão as atualizações na próxima sincronização."
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button
            variant="outlined"
            sx={{ flex: 1 }}
            onClick={handleClose}
            disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
