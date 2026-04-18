"use client";

import { AlertColor, Button, Checkbox, CircularProgress, Stack } from "@mui/material";
import Modal from "../Modal";
import { NewPermissionProfileModalProps } from "./interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/FormControl/Input";
import { ProfilePermissionsFormData, profilePermissionsSchema } from "@/schemas/profilePermissionsSchema";
import { profilePermissionsMock } from "@/data/permissions";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";
import React from "react";
import { useLoading } from "@/hooks/useLoading/hook";
import Toast from "@/components/Toast";

export function NewPermissionProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: NewPermissionProfileModalProps) {
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor; }>({
    open: false, message: "", severity: "info",
  });

  const { isLoading, executeAsyncFunction } = useLoading();

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
      permissoes: profilePermissionsMock[0].permissoes,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({ nome: "", descricao: "", permissoes: profilePermissionsMock[0].permissoes });
    }
  }, [isOpen]);

  const permissions = watch("permissoes");

  async function onSubmit(data: ProfilePermissionsFormData) {
    await executeAsyncFunction(async () => {
      const cargoRes = await fetch("/api/cargos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          descricao: data.descricao,
          permissoes_modulos: (data.permissoes ?? []).map((p) => ({
            modulo: p.modulo,
            visualizar: p.visualizar,
            criar: p.criar,
            editar: p.editar,
            excluir: p.excluir,
          })),
        }),
      });

      if (!cargoRes.ok) {
        const err = await cargoRes.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Erro ao criar perfil");
      }

      setToast({ open: true, message: "Perfil criado com sucesso!", severity: "success" });
      onSuccess?.();
      onClose();
    }).catch((err: Error) => {
      setToast({ open: true, message: err.message || "Erro ao criar perfil.", severity: "error" });
    });
  }

  return (
    <>
      <Modal
        title={"Criar Novo Perfil"}
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
            <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Criar Perfil"}
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </>
  );
}
