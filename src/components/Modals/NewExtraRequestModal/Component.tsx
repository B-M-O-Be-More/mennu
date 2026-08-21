import { Stack, Button, useTheme } from "@mui/material";
import { mockExtraRequestTypes, mockUsers } from "../../../data/menuItems";
import { NewExtraRequestModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EyeIcon } from "@/components/Icons";
import { createExtraRequestSchema, CreateExtraRequestFormData } from "@/schemas/extraRequestSchema";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";

export default function NewExtraRequestModal({ open, onClose }: NewExtraRequestModalProps) {
  const theme = useTheme();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CreateExtraRequestFormData>({
    resolver: yupResolver(createExtraRequestSchema),
    defaultValues: {
      usuario: mockUsers[0].value,
      tipo: mockExtraRequestTypes[0].value,
      motivo: "",
    },
  });


  const onSubmit = (data: CreateExtraRequestFormData) => {
    console.log("Novo usuário:", data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova Solicitação Extra">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Usuário"
          options={mockUsers}
          name="usuario"
          control={control}
          error={errors.usuario?.message}
          optional={false}
        />

        <Select
          label="Tipo de Solicitação"
          options={mockExtraRequestTypes}
          name="tipo"
          control={control}
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

        <ClosableAlertBox
          severity="info"
          icon={
            <EyeIcon color={theme.palette.info.contrastText} />
          }
          title="Workflow de Aprovação"
          description='A solicitação será criada com status "Pendente" e encaminhada para análise do gestor responsável. Todas as solicitações são registradas em log de auditoria.'
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
          >
            Criar Solicitação
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
