import { Stack, Button } from "@mui/material";
import { mockStatuses } from "../../../data/menuItems";
import { NewUnitModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IUnit } from "@/data/tableColumns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { unitSchema } from "@/schemas/unitSchema";

export default function NewUnitModal({ open, onClose }: NewUnitModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUnit>({
    resolver: yupResolver(unitSchema),
    defaultValues: {
      nome: "",
      endereco: "",
      responsavel: "",
      status: mockStatuses[0].value,
      politicas: {
        horarios: {
          cafeManha: { inicio: "", fim: "" },
          almoco: { inicio: "", fim: "" },
          jantar: { inicio: "", fim: "" },
        },
        limites: {
          diario: 0,
          semanal: 0,
          mensal: 0,
        },
      },
    }
  });

  const onSubmit = (data: IUnit) => {
    console.log("Nova unidade:", data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova Unidade">
      <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome da Unidade"
          placeholder="Ex: Unidade Central"
          optional={false} sx={{ flex: 1 }}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Input
          label="Endereço"
          placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
          optional={false}
          sx={{ flex: 1 }}
          register={register("endereco")}
          error={errors.endereco?.message}
        />

        <Input
          label="Responsável"
          placeholder="Nome do responsável"
          optional={false}
          sx={{ flex: 1 }}
          register={register("responsavel")}
          error={errors.responsavel?.message}
        />

        <Select
          label="Status"
          optional={true}
          options={mockStatuses}
          register={register("status")}
          error={errors.status?.message}
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
            sx={{
              flex: 1,
            }}
            variant="contained"
            type="submit"
          >
            Criar Unidade
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
