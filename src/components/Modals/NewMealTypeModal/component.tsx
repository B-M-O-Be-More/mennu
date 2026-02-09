"use client";

import Modal from "@/components/Modals/Modal";
import type { NewMealTypeModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Box, Button, Stack } from "@mui/material";
import TextArea from "@/components/FormControl/TextArea";
import Select from "@/components/FormControl/Select";
import { mockStatuses } from "@/data/menuItems";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import MealValidationList from "@/components/MealsPage/MealValidationList";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealTypeInput, MealTypeSchema } from "@/schemas/mealTypeSchema";
import { useForm } from "react-hook-form";
import { mealValidations, unitsMock } from "@/data/meals";
import TimePicker from "@/components/FormControl/TimePicker";
import { timeRangeFormToApi } from "@/adapters/timeRangeAdapter";
import { CreateMealTypePayload } from "@/Interfaces/Meals/MealTypes";

export function NewMealTypeModal({ open, onClose }: NewMealTypeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MealTypeSchema),
    defaultValues: {
      typeName: "",
      description: "",
      startTime: null,
      endTime: null,
      status: false,
      units: [],
      validations: [],
    },
  });

  function onSubmit(data: MealTypeInput) {
    const timeISO = timeRangeFormToApi(data);

    const payload: CreateMealTypePayload = {
      ...data,
      ...timeISO,
    };

    console.log(payload);
    reset();
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

        <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
          <Box width={"50%"}>
            <TimePicker
              label="Horário de início"
              control={control}
              name="startTime"
            />
          </Box>

          <Box width={"50%"}>
            <TimePicker
              label="Horário de Fim"
              control={control}
              name="endTime"
            />
          </Box>
        </Stack>

        <CheckboxGroup
          label="Unidades"
          sublabel="(Selecione onde este tipo estará disponível)"
          optional={false}
          options={unitsMock}
          name="units"
          control={control}
          error={errors.units?.message}
        />

        <MealValidationList
          label={"Validações Necessárias"}
          options={mealValidations}
          name="validations"
          control={control}
          error={errors.validations?.message}
        />

        <Select
          label={"Status"}
          options={mockStatuses}
          name="status"
          control={control}
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
