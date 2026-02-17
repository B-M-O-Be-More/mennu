import { Box, Skeleton, Stack } from "@mui/material";
import Card from "@/components/Cards/Card";
import { InfoCardSkeletonProps } from "./interface";

export function InfoCardSkeleton({}: InfoCardSkeletonProps) {
  return (
    <Card>
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        <Skeleton
          variant="rounded"
          width={50}
          height={50}
          sx={{ borderRadius: 3 }}
        />
        <Box>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={100} height={40} />
        </Box>
      </Stack>
    </Card>
  );
}
