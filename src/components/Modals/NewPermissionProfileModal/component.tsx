"use client";

import { Button, Checkbox, Stack } from "@mui/material";
import Modal from "../Modal";
import { NewPermissionProfileModalProps } from "./interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/FormControl/Input";
import { ProfilePermissionsFormData, profilePermissionsSchema } from "@/schemas/profilePermissionsSchema";
import { profilePermissionsMock } from "@/data/permissions";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/ProfilePermissions";


export function NewPermissionProfileModal({
  isOpen,
  onClose,
}: NewPermissionProfileModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profilePermissionsSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: profilePermissionsMock[0].permissoes,
    },
  });

  const permissions = watch("permissoes");

  function onSubmit(data: ProfilePermissionsFormData) {
    console.log(data);

    onClose();
  }

  return (
    <Modal
      title={"Registro Manual de Refeição"}
      maxWidth="md"
      open={isOpen}
      onClose={onClose}>
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>

        <Input
          label="Nome"
          placeholder="Ex: Supervisor"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Input
          label="Descricao"
          placeholder="Descreva as responsabilidades deste perfil"
          multiline
          optional={false}
          register={register("descricao")}
          error={errors.descricao?.message}
        />

        <Table
          initialRowsPerPage={25}
          columns={permissionsColumns.map((col) =>
            ["visualizar", "editar", "excluir", "criar"].includes(col.key as string)
              ? {
                ...col,
                render: (_row: IProfilePermissionsItems, rowIndex: number) => {
                  const key = col.key as keyof IProfilePermissionsItems;
                  return (
                    <Checkbox {...register(`permissoes.${rowIndex}.${key}`)} />
                  );
                }
              }
              : col
          )}
          rows={permissions || []}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit">
            Criar Registro
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
