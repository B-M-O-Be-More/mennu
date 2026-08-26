import { Stack, Button, Checkbox } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { EditPermissionProfileModalProps } from "./";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { ProfilePermissionsFormData, profilePermissionsSchema } from "@/schemas/profilePermissionsSchema";
import React from "react";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";

export default function EditPermissionProfileModal({
  open,
  onClose,
  profilePermissions,
  onSave,
}: EditPermissionProfileModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfilePermissionsFormData>(
    {
      resolver: yupResolver(profilePermissionsSchema),
      defaultValues: {
        ...profilePermissions,
        permissoes: profilePermissions.permissoes_modulos ?? [],
      }
    });

  const permissions = watch("permissoes");

  React.useEffect(() => {
    if (open && profilePermissions) {
      reset({
        ...profilePermissions,
        permissoes: profilePermissions.permissoes_modulos ?? [],
      });
    }
  }, [open, profilePermissions, reset]);

  const onSubmit = (data: ProfilePermissionsFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Cargo">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome"
          placeholder="Ex: Supervisor"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Input
          label="Descrição"
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
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal >
  );
}
