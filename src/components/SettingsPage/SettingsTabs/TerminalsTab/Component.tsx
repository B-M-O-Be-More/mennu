import React from "react";
import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import { TerminalsTabProps } from "./interface";
import {
  AlertIcon,
  ClockIcon,
  NoWifiIcon,
  PlusIcon,
  TerminalIcon,
  WifiIcon,
} from "@/components/Icons";
import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import { cardsTerminalsConfig } from "@/data/infos";
import ActionCell from "@/components/ActionCell";
import NewTerminalModal from "@/components/Modals/NewTerminalModal";
import EditTerminalModal from "@/components/Modals/EditTerminalModal/Component";
import { ITerminal } from "@/Interfaces/Terminal/terminal";

type ApiTerminal = {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  ativo: boolean;
  unidade: { id: number; nome: string } | null;
  ultima_sincronizacao?: string;
};

function normalizeTerminalList(payload: unknown): ApiTerminal[] {
  if (Array.isArray(payload)) return payload as ApiTerminal[];
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.results)) return p.results as ApiTerminal[];
  if (p.data) {
    if (Array.isArray(p.data)) return p.data as ApiTerminal[];
    if (typeof p.data === "object" && p.data !== null) {
      const d = p.data as Record<string, unknown>;
      if (Array.isArray(d.results)) return d.results as ApiTerminal[];
    }
  }
  return [];
}

function mapApiToTerminal(t: ApiTerminal): ITerminal {
  return {
    id: String(t.id),
    nome: t.nome,
    tipo: t.tipo,
    status: t.status.toUpperCase() as ITerminal["status"],
    ativo: t.ativo,
    unidade: t.unidade?.nome ?? "",
    unidadeId: t.unidade?.id,
    ultimaSync: t.ultima_sincronizacao,
  };
}

export default function TerminalsTab({}: TerminalsTabProps) {
  const theme = useTheme();
  const [openNewTerminalModal, setOpenNewTerminalModal] = React.useState(false);
  const [openEditTerminalModal, setOpenEditTerminalModal] = React.useState(false);
  const [selectedTerminal, setSelectedTerminal] = React.useState<ITerminal>({} as ITerminal);
  const [terminals, setTerminals] = React.useState<ITerminal[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/terminais/")
      .then((r) => r.json())
      .then((payload) => setTerminals(normalizeTerminalList(payload).map(mapApiToTerminal)))
      .catch(() => setTerminals([]));
  }, [refreshKey]);

  const getStatusColor = (
    status: ITerminal["status"],
  ): "success" | "default" | "warning" | "error" => {
    switch (status) {
      case "ONLINE":
        return "success";
      case "OFFLINE":
        return "default";
      case "DESATUALIZADO":
      case "MANUTENCAO":
        return "warning";
      case "ERRO":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return <WifiIcon color={theme.palette.success.contrastText} width={16} height={16} />;
      case "OFFLINE":
        return <NoWifiIcon color={theme.palette.text.secondary} width={16} height={16} />;
      default:
        return <AlertIcon color={theme.palette.warning.contrastText} width={16} height={16} />;
    }
  };

  const handleToggle = async (terminal: ITerminal) => {
    await fetch(`/api/terminais/${terminal.id}/toggle-status`, { method: "PATCH" });
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={400}>
            Terminais Cadastrados
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
            Gerencie os terminais de acesso às refeições
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{ fontWeight: 400, paddingY: 1.5 }}
          onClick={() => setOpenNewTerminalModal(true)}
        >
          Novo Terminal
        </Button>
      </Stack>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
      >
        {cardsTerminalsConfig.map((card, i) => (
          <Card key={i} flexDirection="row" alignItems="center" gap={0} paddingY={1.5}>
            <IconBox
              icon={card.icon}
              bgColor="transparent"
              padding={2}
              maxWidth="fit-content"
              borderRadius={3}
            />
            <Box>
              <Typography color="text.secondary" variant="body1" fontWeight={400}>
                {card.title}
              </Typography>
              <Typography variant="h5" fontWeight={400} color="text.primary">
                {card.value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {terminals.map((terminal) => {
        const statusColor = getStatusColor(terminal.status);
        return (
          <Card key={terminal.id}>
            <Stack
              justifyContent="space-between"
              direction="row"
              borderBottom="1px solid"
              borderColor="divider"
              paddingBottom={2}
            >
              <Stack direction="row" gap={1}>
                <IconBox
                  icon={<TerminalIcon color={theme.palette[statusColor].contrastText} />}
                  bgColor={theme.palette[statusColor].main}
                  padding={2}
                  borderRadius={3}
                />
                <Box>
                  <Typography variant="body1">{terminal.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {terminal.unidade} • {terminal.tipo}
                  </Typography>
                  <Stack direction="row" alignItems="center" marginTop={0.5} spacing={0}>
                    {getStatusIcon(terminal.status)}
                    <Chip
                      label={terminal.status}
                      color={statusColor}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 12,
                        "& .MuiChip-label": { padding: 0 },
                        mx: 0.5,
                        textTransform: "capitalize",
                        mr: 2,
                      }}
                    />
                    {terminal.ultimaSync && (
                      <>
                        <ClockIcon color={theme.palette.text.secondary} width={16} height={16} />
                        <Typography variant="caption" color="text.secondary" ml={0.5}>
                          Última sync: {terminal.ultimaSync}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" gap={1} height="fit-content">
                {terminal.status === "DESATUALIZADO" && (
                  <Chip label="Revisar Configurações" size="small" color="warning" />
                )}
                <ActionCell
                  checked={terminal.ativo}
                  tooltipToggle="Ativar/Desativar terminal"
                  onToggle={() => handleToggle(terminal)}
                  tooltipEdit="Editar terminal"
                  onEdit={() => {
                    setSelectedTerminal(terminal);
                    setOpenEditTerminalModal(true);
                  }}
                  sxProps={{ ml: "auto" }}
                />
              </Stack>
            </Stack>

            {terminal.refeicoesPermitidas && terminal.refeicoesPermitidas.length > 0 && (
              <Stack direction="row" gap={2} mt={1}>
                <Stack flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Refeições Permitidas:
                  </Typography>
                  <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                    {terminal.refeicoesPermitidas.map((ref) => (
                      <Chip key={ref} label={ref} size="small" color="info" />
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Card>
        );
      })}

      <NewTerminalModal
        open={openNewTerminalModal}
        onClose={() => setOpenNewTerminalModal(false)}
        onSuccess={() => {
          setOpenNewTerminalModal(false);
          setRefreshKey((k) => k + 1);
        }}
      />
      <EditTerminalModal
        open={openEditTerminalModal}
        onClose={() => setOpenEditTerminalModal(false)}
        terminal={selectedTerminal}
        onSave={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
}
