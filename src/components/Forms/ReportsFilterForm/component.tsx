import { timeRangeFormToApi } from "@/adapters/timeRangeAdapter";
import Input from "@/components/FormControl/Input";
import TimePicker from "@/components/FormControl/TimePicker";
import {
  FilterIcon,
  RefeicoesIcon,
  SearchIcon,
  UsuariosIcon,
} from "@/components/Icons";
import { CalendarToday } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { ReportsFilterFormFields } from "./interface";
import Card from "@/components/Cards/Card";
import { useDebounce } from "@/hooks/useDebounce/hook";

export function ReportsFilterForm() {
  const { register, control, reset } = useForm<ReportsFilterFormFields>({
    defaultValues: {
      startTime: null,
      endTime: null,
      user: "",
      mealType: "",
      unit: "",
      terminal: "",
      search: "",
    },
  });

  const instantFilters = useWatch({
    control,
    name: ["startTime", "endTime"],
  });

  const textFilters = useWatch({
    control,
    name: ["search", "user", "unit", "terminal", "mealType"],
  });

  const debouncedFilters = useDebounce(textFilters);

  const timeISO = React.useMemo(
    () =>
      timeRangeFormToApi({
        startTime: instantFilters?.[0],
        endTime: instantFilters?.[1],
      }),
    [instantFilters],
  );

  React.useEffect(() => {
    console.log("Filtros:", { ...debouncedFilters, ...timeISO });
  }, [debouncedFilters, timeISO]);

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
            lg: "repeat(4, 1fr)",
          }}>
          <TimePicker
            label="Período – Início"
            labelIcon={<CalendarToday />}
            name="startTime"
            control={control}
          />

          <TimePicker
            label="Período – Fim"
            labelIcon={<CalendarToday />}
            name="endTime"
            control={control}
          />

          <Input
            label="Usuário"
            labelIcon={<UsuariosIcon />}
            placeholder="Nome"
            register={register("user")}
          />

          <Input
            label="Tipo de Refeição"
            labelIcon={<RefeicoesIcon />}
            placeholder="Tipo de refeição"
            register={register("mealType")}
          />

          <Input
            label="Unidade"
            placeholder="Ex: Unidade 1"
            register={register("unit")}
          />
          <Input
            label="Terminal"
            placeholder="Ex: Terminal 1"
            register={register("terminal")}
          />
          <Input
            icon={<SearchIcon />}
            label="Buscar"
            placeholder="Nome ou matrícula..."
            register={register("search")}
          />

          <Button
            variant="outlined"
            onClick={() => reset()}
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
