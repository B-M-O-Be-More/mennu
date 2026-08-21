import { Stack, Theme, Typography, useTheme } from "@mui/material";
import { BlockedTabProps } from "./interface";
import IconBox from "@/components/Cards/IconBox/Component";
import { AlertIcon, ConfiguracoesIcon, ErrorOutlineIcon, NoWifiIcon } from "@/components/Icons";
import { TerminalStatus } from "@/Interfaces/Terminal/terminal";
import type { ReactNode } from "react";

type BlockedTabContent = {
  icon: ReactNode;
  title: string;
  description: string;
  severity: "error" | "warning";
};

function getBlockedTabContent(status: TerminalStatus, theme: Theme): BlockedTabContent {
  switch (status) {
    case "offline":
      return {
        icon: <NoWifiIcon height={60} width={60} color={theme.palette.error.contrastText} />,
        title: "Terminal Desconectado",
        description: "Aguardando reconexão com o servidor.",
        severity: "error",
      };
    case "erro":
      return {
        icon: <ErrorOutlineIcon height={60} width={60} color={theme.palette.error.contrastText} />,
        title: "Terminal com Erro",
        description: "Entre em contato com o suporte técnico.",
        severity: "error",
      };
    case "manutencao":
      return {
        icon: <ConfiguracoesIcon height={60} width={60} color={theme.palette.warning.contrastText} />,
        title: "Em Manutenção",
        description: "Terminal temporariamente indisponível.",
        severity: "warning",
      };
    case "desatualizado":
      return {
        icon: <AlertIcon height={60} width={60} color={theme.palette.warning.contrastText} />,
        title: "Atualização Pendente",
        description: "Terminal com versão desatualizada.",
        severity: "warning",
      };
    default:
      return {
        icon: <ErrorOutlineIcon height={60} width={60} color={theme.palette.error.contrastText} />,
        title: "Terminal Indisponível",
        description: "Aguarde a normalização do terminal.",
        severity: "error",
      };
  }
}

export default function BlockedTab({ status }: BlockedTabProps) {
  const theme = useTheme();
  const { icon, title, description, severity } = getBlockedTabContent(status, theme);

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Stack
        alignItems="center"
        gap={2.6}
        bgcolor="background.paper"
        width={{ xs: "90%", sm: "70%", md: "52%", lg: "40%" }}
        borderRadius={6}
        px={{ xs: 2, md: 5 }}
        py={{ xs: 3, md: 5 }}
        border={"1px solid"}
        borderColor={`${severity}.contrastText`}
      >
        <IconBox icon={icon} bgColor={`${severity}.main`} borderRadius="100%" padding={5} />
        <Typography variant="h5" fontWeight="600" textAlign="center">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
