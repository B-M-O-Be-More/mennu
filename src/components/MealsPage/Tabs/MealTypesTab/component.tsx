"use client";

import Card from "@/components/Cards/Card";
import MealTypeCard from "../../../Cards/MealTypeCard";
import { Stack, Typography } from "@mui/material";
import { mealTypesMock } from "@/data/meals";

export function MealTypesTab() {
  return (
    <Card>
      <Typography>Tipos de Refeição Cadastrados</Typography>
      <Stack direction={"row"} flexWrap="wrap" gap={1}>
        {mealTypesMock.map((type) => (
          <MealTypeCard key={type.id} type={type} />
        ))}
      </Stack>
    </Card>
  );
}
