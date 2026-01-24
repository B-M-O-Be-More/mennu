"use client";

import Modal from "@/components/Modals/Modal";
import type { NewMealTypeModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Button, Stack } from "@mui/material";
import TextArea from "@/components/FormControl/TextArea";
import Select from "@/components/FormControl/Select";
import { mockStatuses } from "@/data/menuItems";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import MealValidationList from "@/components/MealsPage/MealValidationList";
import { mealValidations } from "@/data/infos";
import { yupResolver } from "@hookform/resolvers/yup";
import { NewMealTypeInput, NewMealTypeSchema } from "@/schemas/mealTypeSchema";
import { useForm } from "react-hook-form";

export const mockUnits = [
  { id: "1", label: "Unidade 1" },
  { id: "2", label: "Unidade 2" },
  { id: "3", label: "Unidade 3" },
  { id: "4", label: "Unidade 4" },
  { id: "5", label: "Unidade 5" },
];

export function NewMealTypeModal({ open, onClose }: NewMealTypeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(NewMealTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      status: mockStatuses[0].value,
      units: [],
      validations: [],
    },
  });

  function onSubmit(data: NewMealTypeInput) {
    reset();
    console.log(data);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo tipo de refeição">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Input
            label="Nome do tipo"
            placeholder="Ex. Café da Manhã"
            optional={false}
            register={register("typeName")}
            error={errors.typeName?.message}
          />

          <TextArea
            label="Descrição"
            placeholder="Descreva este tipo de refeição"
            optional={false}
            register={register("description")}
            error={errors.description?.message}
          />
        </Stack>

        <Stack direction={"row"} gap={2}>
          <Input
            label="Horário de Início"
            placeholder="Selecione um Horário"
            register={register("startTime", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            error={errors.startTime?.message}
          />

          <Input
            label="Horário de Fim"
            placeholder="Selecione um Horário"
            register={register("endTime", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            error={errors.endTime?.message}
          />
        </Stack>

        <CheckboxGroup
          label="Unidades"
          sublabel="(Selecione onde este tipo estará disponível)"
          optional={false}
          options={mockUnits}
          register={register("units")}
          error={errors.units?.message}
        />

        <MealValidationList
          label={"Validações Necessárias"}
          options={mealValidations}
          register={register("validations")}
          error={errors.validations?.message}
        />

        <Select
          label={"Status"}
          options={mockStatuses}
          register={register("status")}
          error={errors.status?.message}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Criar Tipo
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
