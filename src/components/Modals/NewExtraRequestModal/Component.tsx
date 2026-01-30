import { Stack, Typography, Box, Button } from "@mui/material";
import { mockExtraRequestTypes, mockUsers } from "../../../data/menuItems";
import { NewExtraRequestModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { IUser } from "@/data/tableColumns";
import { yupResolver } from "@hookform/resolvers/yup";
import { EyeIcon } from "@/components/Icons";
import { extraRequestSchema } from "@/schemas/extraRequestSchema";

export default function NewExtraRequestModal({ open, onClose }: NewExtraRequestModalProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{
    usuario: string;
    tipo: string;
    motivo: string;
  }>({
    resolver: yupResolver(extraRequestSchema),
    defaultValues: {
      usuario: mockUsers[0].value,
      tipo: mockExtraRequestTypes[0].value,
      motivo: "",
    },
  });


  const onSubmit = (data: { usuario: string; tipo: string; motivo: string }) => {
    console.log("Novo usuário:", data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova Solicitação Extra">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Usuário"
          options={mockUsers}
          register={register("usuario")}
          error={errors.usuario?.message}
          optional={false}
        />

        <Select
          label="Tipo de Solicitação"
          options={mockExtraRequestTypes}
          register={register("tipo")}
          error={errors.tipo?.message}
          optional={false}
        />

        <Input
          label="Motivo"
          placeholder="Descreva o motivo da solicitação..."
          optional={false}
          sx={{ flex: 1 }}
          register={register("motivo")}
          error={errors.motivo?.message}
          multiline
        />

        <Stack direction={"row"} border={"1px solid"} borderColor={"info.light"} bgcolor={"info.main"} borderRadius={2} p={2} gap={1}>
          <EyeIcon color="info.contrastText" />
          <Box>
            <Typography variant="body1" fontWeight={"400"} color="info.dark" mb={1}>
              Workflow de Aprovação
            </Typography>
            <Typography variant="caption" color="info.contrastText" fontWeight={400}>
              A solicitação será criada com status "Pendente" e encaminhada para análise do gestor responsável. Todas as solicitações são registradas em log de auditoria.
            </Typography>
          </Box>
        </Stack>
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
          >
            Criar Solicitação
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
