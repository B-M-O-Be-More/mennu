import Select from "@/components/FormControl/Select";
import DatePicker from "@/components/FormControl/DatePicker";
import { FilterIcon } from "@/components/Icons";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { ReportsFilterFormProps, ReportsFilterFormValues } from "./interface";
import Card from "@/components/Cards/Card";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import { useUserOptions } from "@/hooks/useUserOptions/hook";

const defaultValues: ReportsFilterFormValues = {
  dataInicio: dayjs().subtract(29, "day"),
  dataFim: dayjs(),
  unidadeId: "all",
  tipoRefeicaoId: "",
  usuarioId: "",
};

export function ReportsFilterForm({ onChange }: ReportsFilterFormProps) {
  const { control, reset } = useForm<ReportsFilterFormValues>({ defaultValues });
  const { unitOptions } = useUnitFilterOptions();
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions();
  const { userOptions } = useUserOptions();

  const values = useWatch({ control });

  React.useEffect(() => {
    onChange(values as ReportsFilterFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.dataInicio, values.dataFim, values.unidadeId, values.tipoRefeicaoId, values.usuarioId]);

  const usuarioOptions = [{ label: "Todos os usuários", value: "" }, ...userOptions];

  return (
    <Card>
      <Stack gap={2}>
        <Stack direction={"row"} gap={1}>
          <FilterIcon />
          <Typography variant="body1">Filtros Avançados</Typography>
        </Stack>

        <Box
          display={"grid"}
          gap={2}
          mb={2}
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          }}>
          <DatePicker label="Período – Início" name="dataInicio" control={control} />
          <DatePicker label="Período – Fim" name="dataFim" control={control} />

          <Select
            label="Unidade"
            options={unitOptions}
            name="unidadeId"
            control={control}
          />

          <Select
            label="Tipo de Refeição"
            options={tipoRefeicaoOptions}
            name="tipoRefeicaoId"
            control={control}
          />

          <Select
            label="Usuário"
            options={usuarioOptions}
            name="usuarioId"
            control={control}
          />

          <Button
            variant="outlined"
            onClick={() => reset(defaultValues)}
            sx={{
              justifySelf: "end",
              alignSelf: "end",
              width: "fit-content",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            }}>
            Limpar Filtros
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
