import { Stack, Button, Alert } from "@mui/material";
import { EditUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema, EditUserSchemaFormData } from "@/schemas/userSchema";
import React from "react";

export default function EditUserModal({ open, onClose, onUpdated, user }: EditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditUserSchemaFormData>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      nome: "",
      password: "",
      numero_cartao: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (open && user) {
      reset({
        nome: user.nome ?? "",
        password: "",
        numero_cartao: user.numero_cartao ?? "",
        email: "",
      });
      setSubmitError(null);
    }
  }, [open, user, reset]);

  const onSubmit = async (data: EditUserSchemaFormData) => {
    if (!user) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const body: Record<string, string> = { nome: data.nome };
      if (data.email) body.email = data.email;
      if (data.password) body.password = data.password;
      if (data.numero_cartao) body.numero_cartao = data.numero_cartao.replace(/\D/g, "");

      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao atualizar usuário" }));
        throw new Error(errData.detail ?? "Erro ao atualizar usuário");
      }

      onUpdated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Usuário">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Input
          label="Nome Completo"
          placeholder="Ex. João Silva"
          optional={false}
          sx={{ flex: 1 }}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Stack direction="row" spacing={2}>
          <Input
            label="E-mail"
            placeholder="Ex. joao.silva@email.com"
            sx={{ flex: 1 }}
            register={register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Número do Cartão"
            placeholder="Ex: 1250458-25"
            sx={{ flex: 1 }}
            register={register("numero_cartao")}
            error={errors.numero_cartao?.message}
          />
        </Stack>

        <Input
          label="Senha"
          type="password"
          placeholder="Deixe em branco para manter a atual"
          register={register("password")}
          error={errors.password?.message}
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
