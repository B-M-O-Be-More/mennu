import { Stack, Typography, Button, useTheme, Alert } from "@mui/material";
import { mockStatuses } from "../../../data/menuItems";
import { CATEGORIA_USUARIO_OPTIONS } from "@/Interfaces/Terminal/terminal";
import { NewUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema, CreateUserSchemaFormData } from "@/schemas/userSchema";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { UsuariosIcon } from "@/components/Icons";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import React from "react";

export default function NewUserModal({ open, onClose, onCreated }: NewUserModalProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();
  const realUnitOptions = unitOptions.filter((option) => option.value !== "all");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateUserSchemaFormData>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      nome: "",
      documento: "",
      matricula: "",
      categoria_usuario: "FUNCIONARIO",
      unidade_id: "",
      status: "false",
      password: "",
      numero_cartao: "",
      email: "",
      telefone: "",
    },
  });

  React.useEffect(() => {
    if (realUnitOptions.length > 0 && !getValues("unidade_id")) {
      setValue("unidade_id", realUnitOptions[0].value, { shouldValidate: false });
    }
  }, [realUnitOptions, getValues, setValue]);

  const onSubmit = async (data: CreateUserSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          documento: data.documento.replace(/\D/g, ""),
          matricula: data.matricula,
          unidade_id: Number(data.unidade_id),
          categoria_usuario: data.categoria_usuario,
          is_active: data.status === "true",
          password: data.password,
          numero_cartao: data.numero_cartao ? data.numero_cartao.replace(/\D/g, "") : undefined,
          email: data.email || undefined,
          telefone: data.telefone || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao criar usuário" }));
        throw new Error(errData.detail ?? "Erro ao criar usuário");
      }

      reset();
      onCreated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Usuário">
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
            label="CPF"
            placeholder="Ex. 000.000.000-00"
            optional={false}
            sx={{ flex: 1 }}
            register={register("documento")}
            error={errors.documento?.message}
          />

          <Input
            label="Matrícula"
            placeholder="Ex. 123456"
            optional={false}
            sx={{ flex: 1 }}
            register={register("matricula")}
            error={errors.matricula?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Categoria"
            optional={false}
            options={CATEGORIA_USUARIO_OPTIONS}
            name="categoria_usuario"
            control={control}
            error={errors.categoria_usuario?.message}
          />

          <Select
            label="Unidade"
            optional={false}
            options={realUnitOptions}
            name="unidade_id"
            control={control}
            error={errors.unidade_id?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Status"
            options={mockStatuses}
            name="status"
            control={control}
            error={errors.status?.message}
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
          placeholder="Mínimo 6 caracteres"
          optional={false}
          register={register("password")}
          error={errors.password?.message}
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
            label="Telefone"
            placeholder="Ex. (00) 00000-0000"
            sx={{ flex: 1 }}
            register={register("telefone")}
            error={errors.telefone?.message}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" fontWeight={400}>
          Usuários inativos não podem acessar o terminal de refeições
        </Typography>

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
            {isSubmitting ? "Criando..." : "Criar Novo Usuário"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
