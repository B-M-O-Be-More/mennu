import { Box, Stack, Typography } from "@mui/material";
import IconBox from "../IconBox";
import { InfoCardProps } from "./interface";
import Card from "../Card";

export function InfoCard({ icon, bgColor, label, value }: InfoCardProps) {
  return (
    <Card
      direction={"row"}
      gap={2}
      height={"100%"}>
      <IconBox icon={icon} bgColor={bgColor} padding={2} borderRadius={3} />
      <Stack justifyContent={"space-between"}>
        <Typography variant="body1" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={500}>
          {value}
        </Typography>
      </Stack>
    </Card>
  );
}
