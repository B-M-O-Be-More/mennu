"use client";

import { Box, Button, Dialog, Stack, Typography, useTheme } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { SendAuditModalProps } from "./interface";

/** Caixa cinza com o número em destaque e o rótulo embaixo. */
function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <Box
      flex={1}
      paddingY={2}
      borderRadius={2}
      bgcolor="background.default"
      textAlign="center"
    >
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default function SendAuditModal({
  open,
  onCancel,
  onConfirm,
  itensConferidos,
  totalFotos,
  isSending = false,
}: SendAuditModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSending) onCancel();
      }}
      maxWidth="xs"
      fullWidth
      keepMounted={false}
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            alignItems: "center",
            textAlign: "center",
            p: { xs: 2, md: 3 },
            gap: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: 2,
          borderRadius: 3,
          bgcolor: "primary.light",
          color: "primary.main",
        }}
      >
        <SendOutlinedIcon fontSize="large" />
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={600}>
          Finalizar auditoria?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Depois do envio, você não poderá alterar quantidades ou excluir fotos.
        </Typography>
      </Box>

      <Stack direction="row" gap={2} width="100%">
        <StatBox value={itensConferidos} label="itens conferidos" />
        <StatBox value={totalFotos} label="fotos anexadas" />
      </Stack>

      <Stack direction="row" gap={2} width="100%">
        <Button
          variant="outlined"
          sx={{
            flex: 1,
            "&:hover": { color: theme.palette.text.primary },
          }}
          onClick={onCancel}
          disabled={isSending}
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          sx={{ flex: 1 }}
          onClick={onConfirm}
          disabled={isSending}
        >
          {isSending ? "Enviando..." : "Confirmar envio"}
        </Button>
      </Stack>
    </Dialog>
  );
}
