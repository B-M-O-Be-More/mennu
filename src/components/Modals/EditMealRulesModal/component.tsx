import { Box, Button, Stack, Switch, Typography, useTheme } from "@mui/material";
import Modal from "../Modal";
import { EditMealRulesModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { CircledCheckIcon, ErrorOutlineIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealRuleInput, mealRuleSchema } from "@/schemas/mealRulesSchema";
import Card from "@/components/Cards/Card";
import React from "react";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";

export function EditMealRulesModal({
  isOpen,
  onClose,
  initialData,
  id,
}: EditMealRulesModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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
    console.log(id, data);
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={"Regras de Consumo"}
      subtitle={initialData.unit}>
      <Stack component={"form"} onSubmit={handleSubmit(handleEdit)} gap={3}>
        <Stack direction={"row"} flexWrap={"wrap"} gap={1}>
          <Box
            sx={{
              maxWidth: { xs: "32%" },
              minWidth: { xs: "100%", sm: "32%" },
            }}>
            <Input
              label="Limite diário"
              placeholder="3"
              helperText="Máximo de refeições por dia"
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
              helperText="Máximo de refeições por semana"
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
              helperText="Máximo de refeições por mês"
              register={register("monthlyLimit", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              error={errors.monthlyLimit?.message}
            />
          </Box>
        </Stack>

        <Input
          label="Intervalo Mínimo (minutos)"
          placeholder="240"
          helperText="Tempo mínimo entre refeições (0 = sem restrição)"
          register={register("minInterval", {
            setValueAs: (v) => (v === "" ? undefined : v),
          })}
          error={errors.minInterval?.message}
        />

        <Card sx={{ padding: 2 }}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}>
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
              checked={watch("isTimeRestricted")}
              onChange={(e) => setValue("isTimeRestricted", e.target.checked)}
            />
          </Stack>
        </Card>

        <ClosableAlertBox
          severity="info"
          icon={
            <CircledCheckIcon color={theme.palette.info.contrastText} />
          }
          title="Propagação Automática"
          description='Use este recurso apenas em casos excepcionais, como falha no terminal. O registro será marcado como "Manual" e auditado.'
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
