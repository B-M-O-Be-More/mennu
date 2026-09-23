import { Stack, Button } from "@mui/material";
import { EditUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { useForm, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema, EditUserSchemaFormData } from "@/schemas/userSchema";
import React from "react";
import { getApiMessage } from "@/utils/apiMessage";

export default function EditUserModal({ open, onClose, onUpdated, user, onNotify }: EditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditUserSchemaFormData>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      nome: "",
      matricula: "",
      password: "",
      numero_cartao: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (open && user) {
      reset({
        nome: user.nome ?? "",
        matricula: user.matricula ?? "",
        password: "",
        numero_cartao: user.numero_cartao ?? "",
        email: "",
      });
    }
  }, [open, user, reset]);

  // Sem isto, o clique em "Salvar" não faz nada quando algum campo é reprovado.
  const onInvalid = (formErrors: FieldErrors<EditUserSchemaFormData>) => {
    const messages = Object.values(formErrors)
      .map((fieldError) => fieldError?.message)
      .filter((message): message is string => Boolean(message));

    onNotify?.(
      messages.length > 0
        ? messages.join(" · ")
        : "Revise os campos destacados antes de continuar.",
      "error",
    );
  };

  const onSubmit = async (data: EditUserSchemaFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const body: Record<string, string> = {
        nome: data.nome,
        matricula: data.matricula,
        // Vai sempre (o campo já vem preenchido com o valor atual): assim
        // apagá-lo significa remover o cartão, e não "não mexer".
        numero_cartao: data.numero_cartao.replace(/\D/g, ""),
      };
      if (data.email) body.email = data.email;
      if (data.password) body.password = data.password;

      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao atualizar usuário"));
      }

      onUpdated();
      onClose();
      onNotify?.(
        getApiMessage(payload, "Usuário atualizado com sucesso"),
        "success",
      );
    } catch (err) {
      onNotify?.(
        err instanceof Error ? err.message : "Erro ao atualizar usuário",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Usuário">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit, onInvalid)}>
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
            label="Matrícula"
            placeholder="Ex. 123456"
            optional={false}
            sx={{ flex: 1 }}
            register={register("matricula")}
            error={errors.matricula?.message}
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
          label="E-mail"
          placeholder="Ex. joao.silva@email.com"
          sx={{ flex: 1 }}
          register={register("email")}
          error={errors.email?.message}
        />

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
