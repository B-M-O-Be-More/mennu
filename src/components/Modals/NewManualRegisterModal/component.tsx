"use client";

import Modal from "@/components/Modals/Modal";
import type { NewManualRegisterModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Button, Stack, useTheme } from "@mui/material";
import Select from "@/components/FormControl/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { AlertIcon } from "@/components/Icons";
import { createManualRegisterSchema, CreateManualRegisterSchemaFormData } from "@/schemas/menuSchema";
import { mockMenuTypes, mockUsuarios } from "@/data/menus";

export function NewManualRegisterModal({ open, onClose }: NewManualRegisterModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateManualRegisterSchemaFormData>({
    resolver: yupResolver(createManualRegisterSchema),
    defaultValues: {
      usuario: mockUsuarios[0].value,
      menu: mockMenuTypes[0].value,
      motivo: "",
      restricoes: [],
    },
  });

  function onSubmit(data: CreateManualRegisterSchemaFormData) {
    console.log(data);

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar Consumo Manual" subtitle="Para exceções e correções operacionais">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>

        <Select
          label={"Usuário"}
          options={mockUsuarios}
          name="usuario"
          control={control}
          error={errors.usuario?.message}
        />

        <Select
          label={"Cardápio (Data + Tipo)"}
          optional={false}
          options={mockMenuTypes}
          name="menu"
          control={control}
          error={errors.menu?.message}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Sistema fora do ar"
          multiline
          register={register("motivo")}
          error={errors.motivo?.message}
        />

        <ClosableAlertBox
          severity="info"
          icon={
            <AlertIcon color={theme.palette.info.contrastText} />
          }
          title="Registro Excepcional"
          description='Use este recurso apenas em casos excepcionais, como falha no terminal. O registro será marcado como "Manual" e auditado.'
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Registrar Consumo
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
