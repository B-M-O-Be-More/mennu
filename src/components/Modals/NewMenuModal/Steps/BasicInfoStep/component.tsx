import { Grid, Typography, Stack, Button } from "@mui/material";
import { mockUnidades, mockStatuses, mockTiposCardapio } from "@/data/menuItems";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { BasicInfoStepProps } from "./";
import TimePicker from "@/components/FormControl/TimePicker";


export function BasicInfoStep({
  register,
  errors,
  trigger,
  setCurrentStep,
  control,
}: BasicInfoStepProps) {
  return (
    <>
      <Typography fontWeight={600} color="text.label">
        Informações Básicas
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
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
          <TimePicker
            label="Horário inicial"
            control={control}
            name="horario.inicio"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TimePicker
            label="Horário final"
            control={control}
            name="horario.fim"
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
          onClick={() => setCurrentStep(0)}
        >
          Voltar
        </Button>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          type="button"
          onClick={async () => {
            const valid = await trigger([
              "unidade",
              "tipo",
              "horario",
              "status",
              "observacao",
            ]);

            if (valid) {
              setCurrentStep(2);
            }
          }}
        >
          Avançar
        </Button>
      </Stack>
    </>
  );
}
