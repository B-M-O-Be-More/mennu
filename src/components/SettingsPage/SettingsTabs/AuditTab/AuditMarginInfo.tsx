import { Box, Typography } from "@mui/material";

export default function AuditMarginInfo() {
  return (
    <Box
      bgcolor="info.main"
      border="1px solid"
      borderColor="info.light"
      borderRadius={3}
      p={2}
      color="info.dark"
    >
      <Typography fontWeight={600} color="info.contrastText" mb={0.5}>
        Tipo de margem
      </Typography>
      <Typography variant="body2">
        <strong>Absoluto</strong>
        <br />– Aplica o mesmo valor a todos os insumos, independentemente da
        quantidade em estoque.
      </Typography>
      <Typography variant="body2" mt={0.5}>
        <strong>Percentual</strong>
        <br />– Calcula a margem com base no estoque teórico de cada insumo. Se
        o estoque teórico for zero, qualquer quantidade encontrada será
        considerada divergência.
      </Typography>
      <Typography variant="body2" mt={0.5}>
        – Por Padrão: 0% e 0unid.
      </Typography>
      <Typography variant="body2" mt={0.5}>
        <strong>Cuidado:</strong> valores altos absolutos podem ocultar
        divergências em insumos com estoque pequeno.
      </Typography>
    </Box>
  );
}
