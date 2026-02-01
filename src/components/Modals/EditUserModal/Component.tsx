import { Stack, Button, useTheme } from "@mui/material";
import { mockTipoUsuario, mockStatuses, mockUnidades } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditUserModalProps } from "./";
import { CircledCheckIcon, UsuariosIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { createUserSchema, CreateUserSchemaFormData } from "@/schemas/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { IUser } from "@/Interfaces/User/user";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";

export default function EditUserModal({
  open,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchemaFormData>(
    {
      resolver: yupResolver(createUserSchema),
      defaultValues: { ...user, status: user.status ? "true" : "false" },
    });

  const onSubmit = (data: CreateUserSchemaFormData) => {
    onSave({ ...data, status: data.status === "true" ? true : false } as IUser);
    onClose();
  };

  React.useEffect(() => {
    if (open && user) {
      reset({ ...user, status: user.status ? "true" : "false" });
    }
  }, [open, user, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Editar Usuário">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome Completo"
          placeholder="João Silva"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Stack direction="row" spacing={2}>
          <Input
            label="CPF"
            placeholder="12345678900"
            optional={false}
            sx={{ flex: 1 }}
            register={register("cpf")}
            error={errors.cpf?.message}
          />

          <Input
            label="Matrícula"
            placeholder="12345"
            optional={false}
            sx={{ flex: 1 }}
            register={register("matricula")}
            error={errors.matricula?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            name="categoria"
            control={control}
            label="Categoria"
            optional={false}
            options={mockTipoUsuario}
            register={register("tipo_usuario")}
            error={errors.tipo_usuario?.message}
          />

          <Select
            name="unidade"
            control={control}
            label="Unidade"
            optional={false}
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
          />
        </Stack>

        <Select
          name="status"
          control={control}
          label="Status"
          optional={true}
          options={mockStatuses}
          register={register("status")}
          error={errors.status?.message}
        />

        <ClosableAlertBox
          severity="info"
          icon={
            <UsuariosIcon color={theme.palette.info.contrastText} />
          }
          title="Acesso aos Terminais"
          description="Este usuário poderá acessar os terminais de refeição da unidade selecionada. As políticas da unidade (horários e limites) serão aplicadas automaticamente."
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
            }}
            variant="contained"
            type="submit"
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal >
  );
}
