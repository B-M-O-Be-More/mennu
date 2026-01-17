import { Stack, Button } from "@mui/material";
import { mockStatuses } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IUnit } from "@/data/tableColumns";
import { EditUnitModalProps } from "./";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { unitSchema } from "@/schemas/unitSchema";


export default function EditUnitModal({
  open,
  onClose,
  unitItem,
  onSave,
}: EditUnitModalProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUnit>(
    {
      resolver: yupResolver(unitSchema),
      defaultValues:
        unitItem ||
        {
          nome: "",
          endereco: "",
          responsavel: "",
          status: mockStatuses[0].value,
          politicas: {
            horarios:
            {
              cafeManha: { inicio: "", fim: "" },
              almoco: { inicio: "", fim: "" },
              jantar: { inicio: "", fim: "" },
            }, limites: { diario: 0, semanal: 0, mensal: 0 },
          },
        },
    });

  const onSubmit = (data: IUnit) => {
    onSave(data);
    onClose();
  };


  return (
    <Modal open={open} onClose={onClose} title="Editar Unidade">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
          sx={{ flex: 1 }}
          register={register("endereco")}
          error={errors.endereco?.message}
        />

        <Input
          label="Responsável"
          placeholder="Ex. João Silva"
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
