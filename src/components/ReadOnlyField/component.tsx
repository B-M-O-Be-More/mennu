import { Box, Typography } from "@mui/material";
import { ReadOnlyFieldProps } from "./interface";

/**
 * Campo de leitura das telas de auditoria: rótulo em cima e o valor numa
 * caixa com a mesma borda dos inputs — o usuário vê o dado no lugar onde
 * esperaria editá-lo, sem o campo ficar habilitado.
 */
export default function ReadOnlyField({
  label,
  value,
  align = "center",
  sx,
}: ReadOnlyFieldProps) {
  return (
    <Box flex={1} sx={sx}>
      <Typography variant="body2" color="text.label" mb={1}>
        {label}
      </Typography>
      <Box
        border="1px solid"
        borderColor="divider"
        borderRadius={2}
        paddingY={1.5}
        paddingX={2}
        textAlign={align}
      >
        <Typography variant="body1" color="text.primary">
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}
