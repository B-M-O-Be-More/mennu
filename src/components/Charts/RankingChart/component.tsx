"use client";

import { Box, Stack, Typography } from "@mui/material";
import { RankingChartProps } from "./interface";
import Card from "@/components/Cards/Card";
import RankingChartSkeleton from "@/components/Skeletons/Charts/RankingChartSkeleton";
import EmptyState from "@/components/EmptyState";

export function RankingChart({
  title,
  data,
  unit = "refeições",
  barColor = "primary.main",
  isLoading = false,
}: RankingChartProps) {
  const sortedData = data.toSorted((a, b) => b.value - a.value);
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return isLoading ? (
    <RankingChartSkeleton />
  ) : (
    <Card spacing={2} width={"100%"}>
      <Typography variant="h6" fontWeight={500} fontSize={18}>
        {title}
      </Typography>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack gap={2}>
          {sortedData.map((item) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <Box key={item.label}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body1">{item.label}</Typography>
                  <Typography
                    variant="caption"
                    fontSize={14}
                    color="text.secondary">
                    {item.value} {unit}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    height: 10,
                    borderRadius: 4,
                    backgroundColor: "divider",
                    overflow: "hidden",
                  }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
