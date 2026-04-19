import { Box, Button, Chip, CircularProgress, IconButton, Stack, Switch, Tooltip, Typography, useTheme } from "@mui/material";
import { TerminalsTabProps } from "./interface";
import { AlertIcon, CircledCheckIcon, ClockIcon, EditIcon, NoWifiIcon, PlusIcon, TerminalIcon, TrashIcon } from "@/components/Icons";
import React from "react";
import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import NewTerminalModal from "@/components/Modals/NewTerminalModal";
import EditTerminalModal from "@/components/Modals/EditTerminalModal/Component";
import ConfirmDeleteModal from "@/components/Modals/ConfirmDeleteModal";
import { ITerminal } from "@/Interfaces/Terminal/terminal";
import useFetch from "@/hooks/useFetch/hook";

interface ApiTerminal {
  id: number;
  nome: string;
  tipo: string;
  uid: string;
  status: string;
  ultimo_ping: string | null;
  ativo: boolean;
}

interface PaginatedTerminais {
  results: ApiTerminal[];
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function mapApiToTerminal(t: ApiTerminal): ITerminal {
  return {
    id: String(t.id),
    nome: t.nome,
    codigo: t.uid,
    unidade: "",
    tipo: t.tipo,
    status: t.status as ITerminal["status"],
    ultimaSync: formatDateTime(t.ultimo_ping),
    refeicoesPermitidas: [],
    categoriasPermitidas: [],
    ativo: t.ativo,
  };
}

export default function TerminalsTab({ }: TerminalsTabProps) {
  const theme = useTheme();
  const [terminals, setTerminals] = React.useState<ITerminal[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [openNewTerminalModal, setOpenNewTerminalModal] = React.useState(false);
  const [openEditTerminalModal, setOpenEditTerminalModal] = React.useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
  const [selectedTerminal, setSelectedTerminal] = React.useState<ITerminal>({} as ITerminal);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [requestTerminais, isLoading] = useFetch<PaginatedTerminais>();

  React.useEffect(() => {
    requestTerminais("/api/terminais/", { method: "GET" })
      .then((resp) => {
        const raw = resp as unknown as PaginatedTerminais;
        setTerminals((raw.results ?? []).map(mapApiToTerminal));
      })
      .catch(() => setTerminals([]));
  }, [refreshKey]);

  const handleToggle = async (terminal: ITerminal) => {
    await fetch(`/api/terminais/${terminal.id}/toggle-status`, { method: "PATCH" });
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTerminal?.id) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/terminais/${selectedTerminal.id}/`, { method: "DELETE" });
      setOpenConfirmDelete(false);
      setRefreshKey((k) => k + 1);
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = React.useMemo(() => ({
    online: terminals.filter((t) => t.status === "online").length,
    offline: terminals.filter((t) => t.status === "offline").length,
    desatualizado: terminals.filter((t) => t.status === "desatualizado").length,
    total: terminals.length,
  }), [terminals]);

  const statusCards = [
    { title: "Online", value: stats.online, icon: <CircledCheckIcon color="#00A63E" /> },
    { title: "Offline", value: stats.offline, icon: <NoWifiIcon color="#E7000B" /> },
    { title: "Desatualizados", value: stats.desatualizado, icon: <AlertIcon color="#BB4D00" /> },
    { title: "Total", value: stats.total, icon: <TerminalIcon color="#155DFC" /> },
  ];

  const getStatusProps = (status: ITerminal["status"]) => {
    switch (status) {
      case "online": return "success";
      case "offline": return "default";
      case "desatualizado": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "online": return <CircledCheckIcon color={theme.palette.success.contrastText} width={16} height={16} />;
      case "offline": return <NoWifiIcon color={theme.palette.default.contrastText} width={16} height={16} />;
      case "desatualizado": return <AlertIcon color={theme.palette.warning.contrastText} width={16} height={16} />;
    }
  };

  return (
    <>
      <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'}>
        <Box>
          <Typography variant="h6" fontWeight={'400'}>Terminais Cadastrados</Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={'400'}>
            Gerencie os terminais de acesso às refeições
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{ fontWeight: '400', paddingY: 1.5 }}
          onClick={() => setOpenNewTerminalModal(true)}
        >
          Novo Terminal
        </Button>
      </Stack>

      <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))">
        {statusCards.map((card, i) => (
          <Card key={i} flexDirection="row" alignItems="center" gap={0} paddingY={1.5}>
            <IconBox icon={card.icon} bgColor={'transparent'} padding={2} maxWidth='fit-content' borderRadius={3} />
            <Box>
              <Typography color="text.secondary" variant="body1" fontWeight={400}>{card.title}</Typography>
              <Typography variant="h5" fontWeight={400} color="text.primary">{card.value}</Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {isLoading ? (
        <Stack alignItems="center" py={4}><CircularProgress /></Stack>
      ) : (
        terminals.map((terminal) => (
          <Card key={terminal.id}>
            <Stack justifyContent="space-between" direction="row" borderBottom="1px solid" borderColor="divider" paddingBottom={2}>
              <Stack direction="row" gap={1}>
                <IconBox
                  icon={<TerminalIcon color={theme.palette[getStatusProps(terminal.status)].contrastText} />}
                  bgColor={theme.palette[getStatusProps(terminal.status)].main}
                  padding={2}
                  borderRadius={3}
                />
                <Box>
                  <Typography variant="body1">
                    {terminal.nome}{" "}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ position: "relative", top: -4 }}>
                      ({terminal.codigo})
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {terminal.unidade ? `${terminal.unidade} • ` : ""}{terminal.tipo}
                  </Typography>
                  <Stack direction="row" alignItems="center" marginTop={0.5} spacing={0}>
                    {getStatusIcon(terminal.status)}
                    <Chip
                      label={terminal.status}
                      color={getStatusProps(terminal.status)}
                      size="small"
                      sx={{ height: 20, fontSize: 12, "& .MuiChip-label": { padding: 0 }, mx: 0.5, textTransform: "capitalize", mr: 2 }}
                    />
                    <ClockIcon color={theme.palette.text.secondary} width={16} height={16} />
                    <Typography variant="caption" color="text.secondary" ml={0.5}>
                      Última sync: {terminal.ultimaSync}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1} height="fit-content">
                {terminal.status === "desatualizado" && (
                  <Chip label={"Revisar Configurações"} size="small" color="warning" />
                )}
                <Tooltip title="Editar terminal" arrow>
                  <IconButton
                    size="small"
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, color: "text.secondary" }}
                    onClick={() => {
                      setSelectedTerminal(terminal);
                      setOpenEditTerminalModal(true);
                    }}
                  >
                    <EditIcon width={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir terminal" arrow>
                  <IconButton
                    size="small"
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, color: "error.contrastText" }}
                    onClick={() => {
                      setSelectedTerminal(terminal);
                      setOpenConfirmDelete(true);
                    }}
                  >
                    <TrashIcon width={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ativar/Desativar terminal" arrow>
                  <Switch
                    checked={terminal.ativo}
                    onChange={() => handleToggle(terminal)}
                    size="medium"
                  />
                </Tooltip>
              </Stack>
            </Stack>
            {(terminal.refeicoesPermitidas.length > 0 || terminal.categoriasPermitidas.length > 0) && (
              <Stack direction="row" gap={2}>
                <Stack flex={1}>
                  <Typography variant="body2" color="text.secondary">Refeições Permitidas:</Typography>
                  <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                    {terminal.refeicoesPermitidas.map((ref) => (
                      <Chip key={ref} label={ref} size="small" color="info" />
                    ))}
                  </Stack>
                </Stack>
                <Stack flex={1}>
                  <Typography variant="body2" color="text.secondary">Categorias Permitidas:</Typography>
                  <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                    {terminal.categoriasPermitidas.map((ref) => (
                      <Chip key={ref} label={ref} size="small" color="purple" />
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Card>
        ))
      )}

      <NewTerminalModal
        open={openNewTerminalModal}
        onClose={() => setOpenNewTerminalModal(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
      {openEditTerminalModal && (
        <EditTerminalModal
          key={selectedTerminal.id}
          open={openEditTerminalModal}
          onClose={() => setOpenEditTerminalModal(false)}
          terminal={selectedTerminal}
          onSave={() => setRefreshKey((k) => k + 1)}
        />
      )}
      <ConfirmDeleteModal
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir terminal"
        description={`Tem certeza que deseja excluir o terminal "${selectedTerminal?.nome}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
    </>
  );
}
