import {
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

export function EditMealRulesModal({
  isOpen,
  onClose,
  initialData,
}: EditMealRulesModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(mealRuleSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  function handleEdit(data: MealRuleInput) {
    reset();
    onClose();
  }

  const isTimeRestricted = useWatch({
    control: control,
    name: "isTimeRestricted",
  });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={"Regras de Consumo"}
      subtitle={initialData.unit}>
      <Stack component={"form"} onSubmit={handleSubmit(handleEdit)} gap={2}>
        <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
          <Box
            sx={{
              maxWidth: { xs: "32%" },
              minWidth: { xs: "100%", sm: "32%" },
            }}>
            <Input
              label="Limite diário"
              placeholder="3"
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
              description="Máximo de refeições por semanaaaa"
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
                Impedir acesso fora dos horários configurados
              </Typography>
            </Box>
          </Stack>
          <Switch
            checked={!!isTimeRestricted}
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
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
