import Card from "@/components/Cards/Card";
import { Skeleton, Stack } from "@mui/material";
import { Vertical7DaysChartSkeletonProps } from "./interface";

export function Vertical7DaysChartSkeleton({}: Vertical7DaysChartSkeletonProps) {
  return (
    <Card sx={{ px: 1 }} gap={2}>
      <Skeleton variant="text" width={300} height={24} />
      <Stack
        direction={"row"}
        height={300}
        maxWidth={"100%"}
        gap={1}
        justifyContent={"space-around"}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Stack key={index} alignItems={"center"} gap={1} width={"10%"}>
            <Skeleton
              variant="rectangular"
              height="100%"
              width={"100%"}
              sx={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
            <Skeleton variant="text" width={"50%"} height={20} />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
