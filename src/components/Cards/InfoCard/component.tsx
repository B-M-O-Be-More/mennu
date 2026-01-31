import { Box, Stack, Typography } from "@mui/material";
import IconBox from "../IconBox";
import { InfoCardProps } from "./interface";
import Card from "../Card";

export function InfoCard({ icon, bgColor, label, value }: InfoCardProps) {
  return (
    <Card>
      <Stack direction={"row"} gap={2} alignItems={"center"}>
        <IconBox icon={icon} bgColor={bgColor} padding={2} borderRadius={3} />
        <Box>
          <Typography variant="body1" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={500}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
