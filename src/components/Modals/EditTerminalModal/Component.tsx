import { Stack, Typography, Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { mockTiposTerminal, mockUnidades } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditTerminalModalProps } from "./";
import { AlertIcon } from "@/components/Icons";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import Card from "@/components/Cards/Card";
import React from "react";


export default function EditTerminalModal({
  open,
  onClose,
  terminal,
  onSave,
}: EditTerminalModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTerminalSchemaFormData>(
    {
      resolver: yupResolver(createTerminalSchema),
      defaultValues: terminal,
    });

  const onSubmit = (data: CreateTerminalSchemaFormData) => {
    onSave(data);
    onClose();
  };

  React.useEffect(() => {
    if (open && terminal) {
      reset(terminal)
    }
  }, [open, terminal, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Editar Terminal">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>

        <Stack direction="row" spacing={2}>
          <Input
            label="ID do Terminal"
            placeholder="Ex: TRM-005"
            optional={false}
            sx={{ flex: 1 }}
            register={register("id")}
            error={errors.id?.message}
          />

          <Input
            label="Nome do Terminal"
            placeholder="Ex. Terminal Principal"
            optional={false}
            sx={{ flex: 1 }}
            register={register("nome")}
            error={errors.nome?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Unidade"
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
            control={control}
          />

          <Select
            label="Tipo"
            options={mockTiposTerminal}
            control={control}
            register={register("tipo")}
            error={errors.tipo?.message}
          />
        </Stack>

        <Card>
          <Typography fontWeight={500} mb={1}>
            Refeições Permitidas
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {["Café da Manhã", "Almoço", "Jantar"].map((ref) => (
              <FormControlLabel
                key={ref}
                control={
                  <Checkbox
                    value={ref}
                    {...register("refeicoesPermitidas")}
                  />
                }
                label={ref}
              />
            ))}
          </Stack>
        </Card>

        <Card sx={{ mt: 2 }}>
          <Typography fontWeight={500} mb={1}>
            Categorias Permitidas
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {["Funcionário", "Gestor", "Visitante", "Terceirizado"].map((cat) => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    value={cat}
                    {...register("categoriasPermitidas")}
                  />
                }
                label={cat}
              />
            ))}
          </Stack>
        </Card>

        <Stack direction={"row"} border={"1px solid"} borderColor={"warning.light"} bgcolor={"warning.main"} borderRadius={2} p={2} gap={1}>
          <AlertIcon color="#E17100" />
          <Box>
            <Typography variant="body1" fontWeight={"400"} color="warning.contrastText" >
              Dependência de Unidade
            </Typography>
            <Typography variant="caption" color="warning.light" fontWeight={400}>
              Os terminais só funcionam se estiverem vinculados a uma unidade ativa. As políticas da unidade serão aplicadas automaticamente ao terminal.
            </Typography>
          </Box>
        </Stack>

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
    </Modal>
  );
}
