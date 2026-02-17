import { Grid, Typography, Stack, Button } from "@mui/material";
import { mockUnidades, mockStatuses, mockTiposCardapio } from "@/data/menuItems";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { BasicInfoStepProps } from "./";


export function BasicInfoStep({
  register,
  errors,
  trigger,
  onClose,
  setCurrentStep,
}: BasicInfoStepProps) {
  return (
    <>
      <Typography fontWeight={600} color="text.label">
        Informações Básicas
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            label="Data do Cardápio"
            placeholder="Ex: 01/01/2024"
            optional={false}
            sx={{ flex: 1 }}
            register={register("data")}
            error={errors.data?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Select
            label="Unidade"
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Select
            label="Tipo de Refeição"
            options={mockTiposCardapio}
            register={register("tipo")}
            error={errors.tipo?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Select
            label="Status"
            options={mockStatuses}
            register={register("status")}
            error={errors.status?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            label="Horário de Início"
            placeholder="Ex: 12:00"
            optional={false}
            register={register("horario.inicio")}
            error={errors.horario?.inicio?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            label="Horário de Fim"
            placeholder="Ex: 14:00"
            optional={false}
            register={register("horario.fim")}
            error={errors.horario?.fim?.message}
          />
        </Grid>

        <Grid size={12}>
          <Input
            label="Observações"
            placeholder="Ex: Opção vegetariana disponível"
            type="text"
            multiline
            optional={false}
            register={register("observacao")}
            error={errors.observacao?.message}
          />
        </Grid>
      </Grid>

      <Stack direction="row" gap={2}>
        <Button
          variant="outlined"
          sx={{
            flex: 1,
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
          type="button"
          onClick={async () => {
            const valid = await trigger([
              "data",
              "unidade",
              "tipo",
              "horario",
              "status",
              "observacao",
            ]);

            if (valid) {
              setCurrentStep(1);
            }
          }}
        >
          Avançar
        </Button>
      </Stack>
    </>
  );
}
