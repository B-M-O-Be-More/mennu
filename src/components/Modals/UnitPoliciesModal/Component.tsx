import { Stack, Typography, Button } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { UnitPoliciesModalProps } from "./";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPolicySchema, CreatePolicySchemaFormData } from "@/schemas/unitSchema";

export default function UnitPoliciesModal({
  open,
  onClose,
  unitItem,
  onSave,
}: UnitPoliciesModalProps) {

  const { register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePolicySchemaFormData>(
    {
      resolver:
        yupResolver(createPolicySchema),
      defaultValues: unitItem?.politicas ||
      {
        horarios:
        {
          cafeManha: { inicio: "", fim: "" },
          almoco: { inicio: "", fim: "" },
          jantar: { inicio: "", fim: "" },
        },
        limites: { diario: 0, semanal: 0, mensal: 0 },
      },
    });

  const onSubmit = (data: CreatePolicySchemaFormData) => {
    console.log("Políticas atualizadas:", data);
    const updatedUnit = { ...unitItem, politicas: data };

    onSave(updatedUnit);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Políticas da Unidade"
      subtitle={unitItem?.nome}
      dialogSx={{ maxWidth: "md" }}
    >
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}>
          <Typography variant="h6" fontWeight={"400"}>Horários por Refeição</Typography>
          <Stack
            direction="row"
            spacing={2}
            bgcolor={"#F9FAFB"}
            padding={2}
            borderRadius={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography whiteSpace={"nowrap"}>Café da Manhã</Typography>
            <Stack paddingX={3} minWidth={"300px"} direction="row" gap={2} width={"80%"}>
              <Input
                label="Início"
                placeholder="HH:mm"
                register={register("horarios.cafeManha.inicio")}
                error={errors.horarios?.cafeManha?.inicio?.message}
              />

              <Input
                label="Fim"
                placeholder="HH:mm"
                register={register("horarios.cafeManha.fim")}
                error={errors.horarios?.cafeManha?.fim?.message}
              />
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            bgcolor={"#F9FAFB"}
            padding={2}
            borderRadius={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography whiteSpace={"nowrap"}>Almoço</Typography>
            <Stack paddingX={3} minWidth={"300px"} direction="row" gap={2} width={"80%"}>
              <Input
                label="Início"
                placeholder="HH:mm"
                register={register("horarios.almoco.inicio")}
                error={errors.horarios?.almoco?.inicio?.message}
              />

              <Input
                label="Fim"
                placeholder="HH:mm"
                register={register("horarios.almoco.fim")}
                error={errors.horarios?.almoco?.fim?.message}
              />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            bgcolor={"#F9FAFB"}
            padding={2}
            borderRadius={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography whiteSpace={"nowrap"}>Jantar</Typography>
            <Stack paddingX={3} minWidth={"300px"} direction="row" gap={2} width={"80%"}>
              <Input
                label="Início"
                placeholder="HH:mm"
                register={register("horarios.jantar.inicio")}
                error={errors.horarios?.jantar?.inicio?.message}
              />

              <Input
                label="Fim"
                placeholder="HH:mm"
                register={register("horarios.jantar.fim")}
                error={errors.horarios?.jantar?.fim?.message}
              />
            </Stack>
          </Stack>

        </Stack>

        <Stack gap={2} border="1px solid" borderColor="divider" padding={2} borderRadius={2}>
          <Typography variant="h6" fontWeight={"400"}>Limites de Consumo</Typography>

          <Stack direction="row" spacing={2}>
            <Input
              label="Limite Diário"
              placeholder="0"
              register={register("limites.diario")}
              error={errors.limites?.diario?.message}
            />

            <Input
              label="Limite Semanal"
              placeholder="0"
              register={register("limites.semanal")}
              error={errors.limites?.semanal?.message}
            />

            <Input
              label="Limite Mensal"
              placeholder="0"
              register={register("limites.mensal")}
              error={errors.limites?.mensal?.message}
            />
          </Stack>
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
