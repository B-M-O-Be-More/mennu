"use client";

import { Stack, Typography, Box, Chip, useTheme } from "@mui/material";
import NextLink from "next/link";
import { TerminalCardProps } from "./";
import IconBox from "@/components/Cards/IconBox";
import { NoWifiIcon, TerminalIcon, WifiIcon } from "@/components/Icons";
import React from "react";
import Toast from "@/components/Toast";

export default function TerminalCard({ terminal }: TerminalCardProps) {
  const theme = useTheme();
  const status = terminal.status === "online";

  const [openToast, setOpenToast] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!status) {
      e.preventDefault();
      setOpenToast(true);
      return;
    }
    // Precisa ser síncrono dentro do gesto de clique — a Fullscreen API
    // rejeita chamadas fora de um gesto direto do usuário.
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  return (
    <>
      <Stack
        border="1px solid"
        borderColor="divider"
        borderRadius={3}
        px={2}
        py={3}
        bgcolor={theme.palette.background.paper}
        gap={2}
        sx={{
          cursor: status ? "pointer" : "default",
          textDecoration: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: status ? 3 : 0,
            transform: status ? "translateY(-2px)" : "none",
          },
          width: { xs: "100%", sm: "48%", md: "300px" },
        }}
        component={NextLink}
        href={status ? "/terminal/" + terminal.id : "#"}
        onClick={handleClick}
      >
        <Stack direction="row" gap={1} justifyContent="space-between">
          <Stack direction="row" gap={1}>
            <IconBox
              icon={<TerminalIcon color={theme.palette.info.contrastText} width={20} height={20} />}
              bgColor="info.main"
              padding={1.6}
            />
            <Box>
              <Typography variant="body1" fontWeight="500">
                {terminal.nome}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {terminal.unidadeNome}
              </Typography>
            </Box>
          </Stack>
          {status ? (
            <WifiIcon color={theme.palette.success.contrastText} height={18} width={18} />
          ) : (
            <NoWifiIcon color={theme.palette.error.contrastText} height={18} width={18} />
          )}
        </Stack>
        <Chip
          label={terminal.status}
          color={status ? "success" : "error"}
          sx={{ width: "fit-content", textTransform: "capitalize" }}
        />
      </Stack>

      <Toast
        open={openToast}
        message={`O terminal "${terminal.nome}" (${terminal.unidadeNome}) está offline.`}
        severity="error"
        onClose={() => setOpenToast(false)}
      />
    </>
  );
}
