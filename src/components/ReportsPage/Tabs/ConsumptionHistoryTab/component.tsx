import Card from "@/components/Cards/Card";
import InfoCard from "@/components/Cards/InfoCard";
import ReportsFilterForm from "@/components/Forms/ReportsFilterForm";
import Table from "@/components/Tables/Table";
import { reportsConsumptionHistoryMock, reportsInfoCards } from "@/data/reports";
import { reportsConsumptionHistoryColumns } from "@/data/tableColumns";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { ConsumptionHistoryTabProps } from "./interface";
import InfoCardSkeleton from "@/components/Skeletons/Cards/InfoCardSkeleton";

export function ConsumptionHistoryTab({}: ConsumptionHistoryTabProps) {
  const [cards, setCards] = React.useState<typeof reportsInfoCards | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCards(reportsInfoCards);
      setIsLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <InfoCardSkeleton key={index} />
            ))
          : cards?.map((card) => (
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
          {!isLoading && (
            <Typography variant="body2" color={"text.secondary"}>
              {reportsConsumptionHistoryMock.length} registros encontrados
            </Typography>
          )}
        </Stack>

        <Table
          columns={reportsConsumptionHistoryColumns}
          rows={reportsConsumptionHistoryMock}
          isLoading={isLoading}
        />
      </Card>
    </>
  );
}
