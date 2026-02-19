import { Grid, Typography, Stack, Button } from "@mui/material";
import Select from "@/components/FormControl/Select";
import { PeriodStepProps } from "./";
import CheckboxGroup from "@/components/FormControl/CheckboxGroup";
import { useWatch } from "react-hook-form";
import DatePicker from "@/components/FormControl/DatePicker";
import { mockTiposIntervalo } from "../../Component";
import dayjs from "dayjs";
import React from "react";

const mockWeekDays = [
  { label: "Segunda-feira", id: "segunda" },
  { label: "Terça-feira", id: "terca" },
  { label: "Quarta-feira", id: "quarta" },
  { label: "Quinta-feira", id: "quinta" },
  { label: "Sexta-feira", id: "sexta" },
  { label: "Sábado", id: "sabado" },
  { label: "Domingo", id: "domingo" },
];

export function PeriodStep({
  register,
  errors,
  trigger,
  setCurrentStep,
  onClose,
  control,
  setValue,
}: PeriodStepProps) {
  const tipoIntervalo = useWatch({ control, name: "tipoIntervalo" });
  const vigencia = useWatch({ control, name: "vigencia" });

  React.useEffect(() => {
    if (vigencia?.inicio && vigencia?.fim) {
      const inicio = dayjs(vigencia.inicio);
      const fim = dayjs(vigencia.fim);
      if (!fim.isAfter(inicio)) {
        setValue("vigencia.fim", null);
      }
    }
  }, [vigencia?.inicio, vigencia?.fim, setValue]);

  return (
    <>
      <Typography fontWeight={600} color="text.label">
        Informações de Período
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Select
            label="Tipo de Intervalo"
            options={mockTiposIntervalo}
            register={register("tipoIntervalo")}
            error={errors.tipoIntervalo?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label={"Vigência Início"}
            name={"vigencia.inicio"}
            control={control}
            minDate={dayjs().startOf("day")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label={"Vigência Fim"}
            name={"vigencia.fim"}
            control={control}
            minDate={dayjs(vigencia.inicio).add(1, "day")}
          />
        </Grid>

        <CheckboxGroup
          label="Dias da Semana"
          optional={tipoIntervalo !== "semanal"}
          options={mockWeekDays}
          name="diasSemana"
          control={control}
          error={errors.diasSemana?.message}
          disabled={tipoIntervalo !== "semanal"}
        />
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
              "vigencia",
              "tipoIntervalo",
              "diasSemana",
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
