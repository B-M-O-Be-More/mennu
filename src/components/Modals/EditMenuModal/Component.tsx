import { Stack } from "@mui/material";
import Modal from "../Modal";
import { EditMenuModalProps } from "./";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { createMenuSchema, CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import { mockMenuItems } from "@/data/menus";
import BasicInfoStep from "../NewMenuModal/Steps/BasicInfoStep";
import PeriodStep from "../NewMenuModal/Steps/PeriodStep";
import MealsStep from "../NewMenuModal/Steps/MealsStep";
import dayjs from "dayjs";

export default function EditMenuModal({
  open,
  onClose,
  menu,
  onSave,
}: EditMenuModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateMenuSchemaFormData>(
    {
      resolver: yupResolver(createMenuSchema),
      defaultValues: {
        ...menu,
        vigencia: {
          inicio: dayjs(menu.data),
          fim: null,
        },
        horario: {
          inicio: dayjs(menu.horario.inicio),
          fim: dayjs(menu.horario.fim),
        },
        observacao: menu.observacao || "",
      },
    });

  React.useEffect(() => {
    if (open && menu) {
      reset({
        ...menu,
        vigencia: {
          inicio: dayjs(menu.data),
          fim: null,
        },
        horario: {
          inicio: dayjs(menu.horario.inicio),
          fim: dayjs(menu.horario.fim),
        },
        observacao: menu.observacao || "",
      })
    }
  }, [open, menu, reset]);

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
    onSave(data);

    onClose();
    setCurrentStep(0);
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();

        setCurrentStep(0);
        reset();
      }}
      title="Editar Menu"
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
              setCurrentStep={setCurrentStep}
              onClose={onClose}
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
    </Modal>
  );
}
