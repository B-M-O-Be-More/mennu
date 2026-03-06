import { Stack, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Stack alignItems="center" justifyContent={"center"} py={3} height={"100%"}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Nenhum Item Encontrado
      </Typography>
    </Stack>
  );
}
