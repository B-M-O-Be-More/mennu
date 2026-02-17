"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import Card from "@/components/Cards/Card";
import { RankingChartSkeletonProps } from "./interface";

export function RankingChartSkeleton({}: RankingChartSkeletonProps) {
  return (
    <Card spacing={2} width={"100%"}>
      <Skeleton variant="text" width={200} height={24} />

      <Stack gap={2}>
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={100} height={14} />
              </Stack>

              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={10}
                sx={{ borderRadius: 4 }}
              />
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
