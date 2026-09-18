import { Grid, Typography, Stack, Button } from "@mui/material";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { BasicInfoStepProps } from "./";
import { useWatch } from "react-hook-form";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";

export function BasicInfoStep({
  register,
  errors,
  setCurrentStep,
  control,
  isSubmitting,
}: BasicInfoStepProps) {
  const { unitOptions } = useUnitFilterOptions();
  const unidadeSelecionada = useWatch({ control, name: "unidade" });
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(unidadeSelecionada || undefined);

  const unidadeOptions = [
    { label: "Selecione a unidade", value: "" },
    ...unitOptions.filter((o) => o.value !== "all"),
  ];
  const tipoOptions = [
    { label: "Selecione o tipo de refeição", value: "" },
    ...tipoRefeicaoOptions.filter((o) => o.value !== ""),
  ];

  return (
    <>
      <Typography fontWeight={600} color="text.label">
        Informações Básicas
      </Typography>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Select
            label="Unidade"
            optional={false}
            options={unidadeOptions}
            name="unidade"
            control={control}
            error={errors.unidade?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Select
            label="Tipo de Refeição"
            optional={false}
            options={tipoOptions}
            name="tipo"
            control={control}
            error={errors.tipo?.message}
            disabled={!unidadeSelecionada}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            label="Refeições Previstas"
            placeholder="0"
            type="number"
            register={register("numeroPrevistoRefeicoes")}
            error={errors.numeroPrevistoRefeicoes?.message}
          />
        </Grid>

        <Grid size={12}>
          <Input
            label="Observações"
            placeholder="Ex: Opção vegetariana disponível"
            type="text"
            multiline
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
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Cardápio"}
        </Button>
      </Stack>
    </>
  );
}
