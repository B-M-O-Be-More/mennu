import { Button, Stack } from "@mui/material";
import Modal from "../Modal";
import { EditMealTypeModalProps } from "./interface";
import TextArea from "@/components/FormControl/TextArea";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import MealValidationList from "@/components/MealsPage/MealValidationList";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MealTypeInput, MealTypeSchema } from "@/schemas/mealTypeSchema";
import { mockStatuses } from "@/data/menuItems";
import React from "react";
import { mealValidations, unitsMock } from "@/data/meals";

export function EditMealTypeModal({
  open,
  onClose,
  typeId,
  initialData,
}: EditMealTypeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MealTypeSchema),
    defaultValues: {
      ...initialData,
      units: initialData.units.map((u) => u.id),
      validations: initialData.validations?.map((v) => v.id),
    },
  });

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        ...initialData,
        units: initialData.units.map((u) => u.id),
        validations: initialData.validations?.map((v) => v.id),
      });
    }
  }, [open, initialData, reset]);

  const onEdit = (data: MealTypeInput) => {
    reset();
    console.log(typeId, data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Tipo de Refeição">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onEdit)}>
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
          name="status"
          control={control}
          label={"Status"}
          options={mockStatuses}
          error={errors.status?.message}
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
