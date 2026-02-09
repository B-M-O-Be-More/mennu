"use client";

import { Box, Button, Stack, useTheme } from "@mui/material";
import Modal from "../Modal";
import { NewMealRecordModalProps } from "./interface";
import Select from "@/components/FormControl/Select";
import TextArea from "@/components/FormControl/TextArea";
import { mockTiposRefeicao, mockUsers } from "@/data/menuItems";
import { MealRecordInput, mealRecordSchema } from "@/schemas/mealRecordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { ErrorOutlineIcon } from "@/components/Icons";
import DatePicker from "@/components/FormControl/DatePicker";
import TimePicker from "@/components/FormControl/TimePicker";
import { dateTimeFormToApi } from "@/adapters/dateTimeAdapter";
import { ManualMealRecordPayload } from "@/Interfaces/Meals/MealTypes";

export function NewMealRecordModal({
  isOpen,
  onClose,
}: NewMealRecordModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mealRecordSchema),
    defaultValues: {
      user: mockUsers[0].value,
      mealType: mockTiposRefeicao[0].value,
      date: null,
      time: null,
      reason: "",
    },
  });

  function onSubmit(data: MealRecordInput) {
    const dateTimeISO = dateTimeFormToApi(data);

    const payload: ManualMealRecordPayload = {
      user: data.user,
      mealType: data.mealType,
      dateTime: dateTimeISO,
      reason: data.reason,
      isManual: true,
    };

    reset();
    console.log(payload);
    onClose();
  }

  return (
    <Modal
      title={"Registro Manual de Refeição"}
      open={isOpen}
      onClose={onClose}>
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <ClosableAlertBox
          severity="warning"
          icon={<ErrorOutlineIcon color={theme.palette.warning.contrastText} />}
          title="Registro Excepcional"
          description='Use este recurso apenas em casos excepcionais, como falha no terminal. O registro será marcado como "Manual" e auditado.'
        />

        <Select
          label={"Usuário"}
          optional={false}
          options={mockUsers}
          name="user"
          control={control}
          error={errors.user?.message}
        />

        <Select
          label={"Tipo de Refeição"}
          optional={false}
          options={mockTiposRefeicao}
          name="mealType"
          control={control}
          error={errors.mealType?.message}
        />

        <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
          <Box width={"50%"}>
            <DatePicker label={"Data"} name={"date"} control={control} />
          </Box>

          <Box width={"50%"}>
            <TimePicker label="Horário" control={control} name={"time"} />
          </Box>
        </Stack>

        <TextArea
          label={"Motivo"}
          sublabel="(obrigatório para auditoria)"
          placeholder="Ex: Terminal fora do ar, problema técnico, exceção autorizada..."
          optional={false}
          register={register("reason")}
          error={errors.reason?.message}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Criar Registro
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
