import { Box, Button, Stack, Switch, Typography } from "@mui/material";
import Modal from "../Modal";
import { EditMealRulesModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { CircledCheckIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealRuleInput, mealRuleSchema } from "@/schemas/mealRulesSchema";
import Card from "@/components/Cards/Card";
import { ErrorOutline } from "@mui/icons-material";
import React from "react";

export function EditMealRulesModal({
  isOpen,
  onClose,
  initialData,
  id,
}: EditMealRulesModalProps) {
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

        <Card>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <ErrorOutline />
            <Box component={"span"}>
              <Typography>Bloquear Fora do Horário</Typography>
              <Typography color="text.secondary">
                Impedir acesso fora dos horários configurados
              </Typography>
            </Box>
            <Switch
              checked={watch("isTimeRestricted")}
              onChange={(e) => setValue("isTimeRestricted", e.target.checked)}
            />
          </Stack>
        </Card>

        <Stack
          direction="row"
          borderColor={"info.light"}
          borderRadius={3}
          padding={2}
          gap={2}
          bgcolor={"info.main"}>
          <CircledCheckIcon color={"#1447E6"} />
          <Box>
            <Typography variant="body1" color="info.dark" mb={1}>
              Propagação Automática
            </Typography>
            <Typography variant="body2" color="info.contrastText">
              Essas regras serão aplicadas automaticamente a todos os terminais
              vinculados a esta unidade. Os terminais receberão as atualizações
              na próxima sincronização.
            </Typography>
          </Box>
        </Stack>

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
