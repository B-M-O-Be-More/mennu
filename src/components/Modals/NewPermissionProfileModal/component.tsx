"use client";

import { Button, Checkbox, Stack } from "@mui/material";
import Modal from "../Modal";
import { NewPermissionProfileModalProps } from "./interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/FormControl/Input";
import { ProfilePermissionsFormData, profilePermissionsSchema } from "@/schemas/profilePermissionsSchema";
import { defaultModulePermissions } from "@/data/permissions";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";
import React from "react";
import { getApiMessage } from "@/utils/apiMessage";


export function NewPermissionProfileModal({
  isOpen,
  onClose,
  onCreated,
  onNotify,
}: NewPermissionProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfilePermissionsFormData>({
    resolver: yupResolver(profilePermissionsSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      permissoes: defaultModulePermissions,
    },
  });

  const permissions = watch("permissoes");

  const handleClose = () => {
    reset({
      nome: "",
      descricao: "",
      permissoes: defaultModulePermissions,
    });
    onClose();
  };

  const onSubmit = async (data: ProfilePermissionsFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cargos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome.trim(),
          descricao: data.descricao.trim(),
          permissoes_modulos: (data.permissoes ?? []).map(
            ({ modulo, visualizar, criar, editar, excluir }) => ({
              modulo,
              visualizar,
              criar,
              editar,
              excluir,
            }),
          ),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao criar perfil"));
      }

      onNotify?.(getApiMessage(payload, "Perfil criado com sucesso"), "success");
      onCreated();
      handleClose();
    } catch (err) {
      onNotify?.(
        err instanceof Error ? err.message : "Erro ao criar perfil",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={"Criar Novo Perfil"}
      maxWidth="md"
      open={isOpen}
      onClose={handleClose}>
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
          <Button
            variant="outlined"
            sx={{ flex: 1 }}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando..." : "Criar Perfil"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
