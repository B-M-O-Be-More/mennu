"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import InfoCard from "@/components/Cards/InfoCard";
import Table from "@/components/Tables/Table";
import { mockStatuses, mockUnidades } from "@/data/menuItems";
import { mealRecordsColumns } from "@/data/tableColumns";
import { Box, Button, Stack } from "@mui/material";
import { mealInfoCards, mealRecordsMock } from "@/data/meals";
import { useForm } from "react-hook-form";
import React from "react";

interface SearchFields {
  userSearch: string;
  unit: string;
  status: string;
}

export function MealRecordsTab() {
  const { register, watch } = useForm<SearchFields>({
    defaultValues: {
      userSearch: "",
      status: mockStatuses[0].value,
      unit: mockUnidades[0].value,
    },
  });

  const filters = watch();

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <Card>
      <Stack direction={"row"} gap={2}>
        <Input
          placeholder="Buscar por nome, matrícula..."
          icon={<SearchIcon />}
          register={register("userSearch")}
        />

        <Select
          options={mockUnidades}
          formControlSx={{ maxWidth: "18%" }}
          register={register("unit")}
        />
        <Select
          options={mockStatuses}
          formControlSx={{ maxWidth: "18%" }}
          register={register("status")}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ width: "15%" }}>
          Filtrar
        </Button>
      </Stack>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))">
        {mealInfoCards.map((card) => (
          <InfoCard
            key={card.key}
            icon={card.icon}
            bgColor={card.bgColor}
            label={card.label}
            value={card.value}
          />
        ))}
      </Box>

      <Table columns={mealRecordsColumns} rows={mealRecordsMock} />
    </Card>
  );
}
