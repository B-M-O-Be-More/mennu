import Card from "@/components/Cards/Card";
import { Skeleton, Stack } from "@mui/material";
import { KPICardSkeletonProps } from "./interface";

export function KPICardSkeleton({}: KPICardSkeletonProps) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Stack gap={0.5}>
          <Skeleton variant="text" width={150} height={24} />
          <Skeleton variant="text" width={80} height={18} />
        </Stack>

        <Skeleton
          variant="rounded"
          width={50}
          height={50}
          sx={{ borderRadius: 2 }}
        />
      </Stack>

      <Skeleton variant="text" width={100} height={60} />

      <Skeleton variant="text" width={160} height={20} />
    </Card>
  );
}
