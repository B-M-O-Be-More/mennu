"use client";

import Modal from "@/components/Modals/Modal";
import type { NewMenuItemModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Button, Stack } from "@mui/material";
import Select from "@/components/FormControl/Select";
import { mockTiposRefeicao } from "@/data/menuItems";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CreateMenuItemSchemaFormData, createMenuItemSchema } from "@/schemas/menuSchema";
import { restricoesMock } from "@/data/menus";

export function NewMenuItemModal({ open, onClose }: NewMenuItemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateMenuItemSchemaFormData>({
    resolver: yupResolver(createMenuItemSchema),
    defaultValues: {
      id: -1,
      nome: "",
      descricao: "",
      categoria: mockTiposRefeicao[0].value,
      restricoes: [],
      status: "ativo",
    },
  });

  function onSubmit(data: CreateMenuItemSchemaFormData) {
    reset();
    console.log(data);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo item" subtitle="Preencha as informações do Item">
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
            Criar Item
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
