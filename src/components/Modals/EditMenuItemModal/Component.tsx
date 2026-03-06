import { Button, Stack } from "@mui/material";
import Modal from "../Modal";
import { EditMenuItemModalProps } from "./";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { createMenuItemSchema, CreateMenuItemSchemaFormData } from "@/schemas/menuSchema";
import { restricoesMock } from "@/data/menus";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { mockTiposRefeicao } from "@/data/menuItems";
import { CheckboxGroup } from "@/components/FormControl/CheckboxGroup/component";

export default function EditMenuItemModal({
  open,
  onClose,
  menuItem,
  onSave,
}: EditMenuItemModalProps) {

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateMenuItemSchemaFormData>(
    {
      resolver: yupResolver(createMenuItemSchema),
      defaultValues: {
        ...menuItem,
      },
    });

  React.useEffect(() => {
    if (open && menuItem) {
      reset({
        ...menuItem,
      })
    }
  }, [open, menuItem, reset]);

  const onSubmit = (data: CreateMenuItemSchemaFormData) => {
    onSave(data);

    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Item de Cardápio" subtitle="Preencha as informações do item de cardápio">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome"
          placeholder="Ex: Arroz Branco"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Select
          label={"Categoria"}
          options={mockTiposRefeicao}
          name="categoria"
          control={control}
          error={errors.categoria?.message}
        />

        <Input
          label="Descrição"
          multiline
          placeholder="Ex: Opção vegetariana disponível"
          register={register("descricao")}
          error={errors.descricao?.message}
        />

        <CheckboxGroup
          label="Restrições Alimentares"
          optional={false}
          options={restricoesMock}
          name="restricoes"
          control={control}
          error={errors.restricoes?.message}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Editar Item
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
