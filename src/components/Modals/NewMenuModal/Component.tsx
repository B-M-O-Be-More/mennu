import { Stack } from "@mui/material";
import { mockStatuses } from "../../../data/menuItems";
import { NewMenuModalProps } from ".";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createMenuSchema, CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import React from "react";
import BasicInfoStep from "./Steps/BasicInfoStep";
import MealsStep from "./Steps/MealsStep";
import { mockMenuItems } from "@/data/menus";
import PeriodStep from "./Steps/PeriodStep";
import dayjs from "dayjs";

export const mockTiposIntervalo = [
  { label: "Personalizado", value: "Personalizado" },
  { label: "Semanal", value: "semanal" }
];

export default function NewMenuModal({ open, onClose }: NewMenuModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const {
    handleSubmit,
    register,
    watch,
    reset,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<CreateMenuSchemaFormData>({
    resolver: yupResolver(createMenuSchema),
    defaultValues: {
      vigencia: {
        inicio: dayjs().startOf("day").add(1, "day"),
        fim: null,
      },
      unidade: "",
      tipo: "",
      horario: {
        inicio: dayjs().hour(0).minute(0),
        fim: dayjs().hour(0).minute(0),
      },
      refeicoes: [],
      status: mockStatuses[0].value,
      observacao: "",
      tipoIntervalo: mockTiposIntervalo[0].value,
      diasSemana: [],
    },
  });

  const watchRefeicoes = watch("refeicoes");

  const {
    register: registerSearch,
    watch: watchSearch
  } = useForm<{ menuItemSearch: string }>({
    defaultValues: {
      menuItemSearch: "",
    },
  });

  const searchTerm = watchSearch("menuItemSearch")?.toLowerCase() || "";

  const filteredItems = mockMenuItems.filter(item =>
    item.nome.toLowerCase().includes(searchTerm) ||
    item.descricao.toLowerCase().includes(searchTerm) ||
    item.restricoes.some(c => c.toLowerCase().includes(searchTerm)) ||
    item.categoria.toLowerCase().includes(searchTerm)
  );

  const onSubmit = (data: CreateMenuSchemaFormData) => {
    console.log("Novo cardápio:", data);

    onClose();
    setCurrentStep(0);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();

        setCurrentStep(0);
        reset();
      }}
      title="Novo Cardápio"
      subtitle="Preencha as informações do cardápio"
      maxWidth="md"
    >
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {
          currentStep === 0 && (
            <PeriodStep
              register={register}
              errors={errors}
              trigger={trigger}
              onClose={onClose}
              setCurrentStep={setCurrentStep}
              control={control}
              setValue={setValue}
            />
          )
        }

        {
          currentStep === 1 && (
            <BasicInfoStep
              register={register}
              errors={errors}
              trigger={trigger}
              setCurrentStep={setCurrentStep}
              control={control}
            />
          )
        }

        {
          currentStep === 2 && (
            <MealsStep
              registerSearch={registerSearch}
              filteredItems={filteredItems}
              watchRefeicoes={watchRefeicoes}
              setValue={setValue}
              reset={reset}
              errors={errors}
              setCurrentStep={setCurrentStep}
            />
          )
        }
      </Stack>
    </Modal >
  );
}
