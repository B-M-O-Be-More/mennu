import KPICard from "@/components/Cards/KPICard";
import { RelatoriosIcon } from "@/components/Icons";
import { Box, Stack } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import Vertical7DaysChart from "@/components/Charts/Vertical7DaysChart";
import RankingChart from "@/components/Charts/RankingChart";
import React from "react";
import KPICardSkeleton from "@/components/Skeletons/Cards/KPICardSkeleton";
import { DashboardTabProps, KPICardData } from "./interface";

const mockKPICards: KPICardData[] = [
  {
    id: "total-refeicoes",
    label: "Total Refeições",
    icon: <RelatoriosIcon color="#00A63E" />,
    bgColor: "success.main",
    value: 375,
    trend: 12,
  },
  {
    id: "media-diaria",
    label: "Média Diária",
    bgColor: "info.main",
    icon: <TrendingUp sx={{ color: "info.contrastText" }} />,
    value: 54,
    description: "refeições/dia",
  },
  {
    id: "taxa-cancelamento",
    label: "Taxa de Cancelamento",
    bgColor: "error.main",
    icon: <TrendingDown sx={{ color: "error.contrastText" }} />,
    value: 3.2,
    unit: "%",
    trend: 0,
  },
];

export function DashboardTab({}: DashboardTabProps) {
  const [kpis, setKpis] = React.useState<KPICardData[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setKpis(mockKPICards);
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <Box
        display={"grid"}
        gap={3}
        mb={2}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        sx={{
          "& > :last-of-type:nth-of-type(odd)": {
            gridColumn: {
              sm: "1 / -1",
              md: "auto",
            },
          },
        }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <KPICardSkeleton key={index} />
            ))
          : kpis?.map((card) => (
              <KPICard
                key={card.id}
                label={card.label}
                icon={card.icon}
                bgColor={card.bgColor}
                value={card.value}
                unit={card.unit}
                trend={card.trend}
                description={card.description}
              />
            ))}
      </Box>

      <Vertical7DaysChart
        values={[36, 54, 58, 44, 64, 28, 16]}
        isLoading={isLoading}
      />

      <Stack
        direction={"row"}
        maxWidth={"100%"}
        gap={2}
        flexWrap={"wrap"}
        justifyContent={"space-between"}>
        <RankingChart
          title="Top 5 Tipos de Refeição"
          data={[
            { label: "Almoço", value: 156 },
            { label: "Jantar", value: 92 },
            { label: "Café da Manhã", value: 87 },
            { label: "Lanche", value: 32 },
            { label: "Ceia", value: 8 },
          ]}
          isLoading={isLoading}
        />
        <RankingChart
          title="Distribuição por Unidade"
          data={[
            { label: "Unidade 1", value: 198 },
            { label: "Unidade 3", value: 62 },
            { label: "Unidade 2", value: 115 },
          ]}
          barColor="info.contrastText"
          isLoading={isLoading}
        />
      </Stack>
    </>
  );
}
