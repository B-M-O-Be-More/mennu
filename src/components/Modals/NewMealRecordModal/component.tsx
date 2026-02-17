"use client";

import { Button, Stack, useTheme } from "@mui/material";
import Modal from "../Modal";
import { NewMealRecordModalProps } from "./interface";
import Select from "@/components/FormControl/Select";
import Input from "@/components/FormControl/Input";
import TextArea from "@/components/FormControl/TextArea";
import { mockCategoriaRefeicao, mockTiposCardapio, mockUsers } from "@/data/menuItems";
import {
  ManualMealRecord,
  MealRecordInput,
  mealRecordSchema,
} from "@/schemas/mealRecordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { ErrorOutlineIcon } from "@/components/Icons";

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
      mealType: mockCategoriaRefeicao[0].value,
      date: "",
      time: "",
      reason: "",
    },
  });

  function onSubmit(data: MealRecordInput) {
    const payload: ManualMealRecord = {
      ...data,
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
          icon={
            <ErrorOutlineIcon color={theme.palette.warning.contrastText} />
          }
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
          options={mockTiposCardapio}
          name="mealType"
          control={control}
          error={errors.mealType?.message}
        />

        <Stack direction={"row"} gap={1}>
          <Input
            label="Data"
            placeholder="05/12/2025"
            register={register("date", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            error={errors.date?.message}
          />

          <Input
            label="Horário"
            placeholder="22:30"
            register={register("time", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            error={errors.time?.message}
          />
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
