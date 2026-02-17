import { Stack } from "@mui/material";
import Modal from "../Modal";
import { EditMenuModalProps } from "./";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { createMenuSchema, CreateMenuSchemaFormData } from "@/schemas/menuSchema";
import { mockMenuItems } from "@/data/menus";
import BasicInfoStep from "./Steps/BasicInfoStep";
import MealsStep from "./Steps/MealsStep";

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
    formState: { errors },
  } = useForm<CreateMenuSchemaFormData>(
    {
      resolver: yupResolver(createMenuSchema),
      defaultValues: {
        ...menu,
        observacao: menu.observacao || "",
        data: new Date(menu.data).toLocaleDateString("pt-BR")
      },
    });

  React.useEffect(() => {
    if (open && menu) {
      reset({
        ...menu,
        observacao: menu.observacao || "",
        data: new Date(menu.data).toLocaleDateString("pt-BR")
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
            <BasicInfoStep
              register={register}
              errors={errors}
              trigger={trigger}
              onClose={onClose}
              setCurrentStep={setCurrentStep}
            />
          )
        }

        {
          currentStep === 1 && (
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
