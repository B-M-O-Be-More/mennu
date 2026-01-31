import Card from "@/components/Cards/Card";
import { mealRulesMock } from "@/data/meals";
import { Box, Stack, Typography } from "@mui/material";
import MealRulesCard from "../../../Cards/MealRulesCard";

export function MealRulesTab() {
  return (
    <Card>
      <Box component="span">
        <Typography color="text.primary">
          Regras de Consumo por Unidade
        </Typography>
        <Typography variant="body2" fontWeight={400} color="text.secondary">
          Estas regras são herdadas automaticamente pelos terminais
        </Typography>
      </Box>

      <Stack direction={"row"} flexWrap="wrap" gap={2}>
        {mealRulesMock.map((rule) => (
          <MealRulesCard key={rule.id} rule={rule} />
        ))}
      </Stack>
    </Card>
  );
}
