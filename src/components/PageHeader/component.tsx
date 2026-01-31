import { Box, Stack, Typography } from "@mui/material";
import { PageHeaderProps } from "./interface";

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <Stack gap={2} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
      <Box component="span">
        <Typography
          variant="h4"
          component={"h1"}
          fontWeight={600}
          color="text.primary"
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle2"
          component={"h2"}
          fontWeight={400}
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      </Box>

      <Stack gap={2} direction={"row"} alignItems={"center"}>
        {children}
      </Stack>
    </Stack>
  );
}
