import Card from "@/components/Cards/Card";
import InfoCard from "@/components/Cards/InfoCard";
import ReportsFilterForm from "@/components/Forms/ReportsFilterForm";
import Table from "@/components/Tables/Table";
import { consumptionHistoryMock, reportsInfoCards } from "@/data/reports";
import { consumptionHistoryColumns } from "@/data/tableColumns";
import { Box, Stack, Typography } from "@mui/material";

export function ConsumptionHistoryTab() {
  return (
    <>
      <ReportsFilterForm />

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        }}>
        {reportsInfoCards.map((card) => (
          <InfoCard
            key={card.key}
            icon={card.icon}
            bgColor={card.bgColor}
            label={card.label}
            value={card.value}
          />
        ))}
      </Box>

      <Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Typography>Histórico de Consumo</Typography>
          <Typography variant="body2" color={"text.secondary"}>
            {consumptionHistoryMock.length} registros encontrados
          </Typography>
        </Stack>

        <Table
          columns={consumptionHistoryColumns}
          rows={consumptionHistoryMock}
        />
      </Card>
    </>
  );
}
