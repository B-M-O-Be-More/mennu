import { AlertColor, Button, CircularProgress, Stack, Switch, Typography } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { AutocompleteUser } from "@/components/FormControl/AutocompleteUser";
import { EditUnitModalProps } from "./";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUnitSchema, CreateUnitSchemaFormData } from "@/schemas/unitSchema";
import { useLoading } from "@/hooks/useLoading/hook";
import Toast from "@/components/Toast";
import React from "react";

export default function EditUnitModal({ open, onClose, unitItem, onSave }: EditUnitModalProps) {
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: "", severity: "info",
  });

  const { isLoading, executeAsyncFunction } = useLoading();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateUnitSchemaFormData>({
    resolver: yupResolver(createUnitSchema),
    defaultValues: { nome: "", endereco: "", responsavel: "", ativo: true, horarioAbertura: "", horarioFechamento: "" },
  });

  React.useEffect(() => {
    if (open && unitItem) {
      reset({
        nome: unitItem.nome,
        endereco: unitItem.endereco ?? "",
        responsavel: unitItem.responsavel ?? "",
        ativo: unitItem.status === "ativo",
        horarioAbertura: unitItem.horarioAbertura ?? "",
        horarioFechamento: unitItem.horarioFechamento ?? "",
      });
    }
  }, [open, unitItem]);

  const onSubmit = async (data: CreateUnitSchemaFormData) => {
    if (!unitItem?.id) return;

    await executeAsyncFunction(async () => {
      const res = await fetch(`/api/unidades/${unitItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          endereco: data.endereco || null,
          ativo: data.ativo,
          horario_abertura: data.horarioAbertura ? `${data.horarioAbertura}:00` : null,
          horario_fechamento: data.horarioFechamento ? `${data.horarioFechamento}:00` : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || "Erro ao atualizar unidade");
      }
      setToast({ open: true, message: "Unidade atualizada com sucesso!", severity: "success" });
      onSave();
      onClose();
    }).catch((err: Error) => {
      setToast({ open: true, message: err.message || "Erro ao atualizar unidade.", severity: "error" });
    });
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Editar Unidade">
        <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome da Unidade"
            placeholder="Ex. Unidade Central"
            optional={false}
            register={register("nome")}
            error={errors.nome?.message}
          />

          <Input
            label="Endereço"
            placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
            optional={false}
            register={register("endereco")}
            error={errors.endereco?.message}
          />

          <AutocompleteUser
            key={`responsavel-${unitItem?.id}-${open}`}
            name="responsavel"
            control={control}
            label="Responsável"
            error={errors.responsavel?.message}
            valueKey="nome"
            defaultInputValue={unitItem?.responsavel ?? ""}
          />

          <Stack direction="row" gap={2}>
            <Input
              label="Horário de Abertura"
              placeholder="08:00"
              register={register("horarioAbertura")}
              error={errors.horarioAbertura?.message}
            />
            <Input
              label="Horário de Fechamento"
              placeholder="18:00"
              register={register("horarioFechamento")}
              error={errors.horarioFechamento?.message}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.label" fontWeight={400}>Ativo</Typography>
            <Controller
              name="ativo"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
              )}
            />
          </Stack>

          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              sx={{ flex: 1, fontSize: "1.2rem", border: "1px solid", borderColor: "divider", color: "text.secondary" }}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button sx={{ flex: 1, fontSize: "1.2rem" }} variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Salvar Alterações"}
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
