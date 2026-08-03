"use client";

import { Alert, Box, Button, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { TerminalsTabProps } from "./interface";
import { AlertIcon, ClockIcon, ConfiguracoesIcon, ErrorOutlineIcon, NoWifiIcon, PlusIcon, TerminalIcon, WifiIcon } from "@/components/Icons";
import React from "react";
import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import ActionCell from "@/components/ActionCell";
import NewTerminalModal from "@/components/Modals/NewTerminalModal";
import EditTerminalModal from "@/components/Modals/EditTerminalModal/Component";
import { ITerminal, mapApiTerminalToUi } from "@/Interfaces/Terminal/terminal";
import { CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";
import { formatDate } from "@/utils/formatDate";

export default function TerminalsTab({ }: TerminalsTabProps) {
  const theme = useTheme();
  const [openNewTerminalModal, setOpenNewTerminalModal] = React.useState(false);
  const [openEditTerminalModal, setOpenEditTerminalModal] = React.useState(false);

  const [selectedTerminal, setSelectedTerminal] = React.useState<ITerminal | null>(null);
  const [terminais, setTerminais] = React.useState<ITerminal[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const loadTerminais = React.useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/terminais");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar terminais");
      }
      const results = data.results ?? data;
      setTerminais(results.map(mapApiTerminalToUi));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar terminais");
    }
  }, []);

  React.useEffect(() => {
    loadTerminais();
  }, [loadTerminais]);

  const stats = React.useMemo(() => {
    const online = terminais.filter((t) => t.status === "online").length;
    const offline = terminais.filter((t) => t.status === "offline").length;
    const desatualizados = terminais.filter((t) => t.status === "desatualizado").length;
    return [
      { title: "Online", value: online, icon: <WifiIcon color="#00A63E" /> },
      { title: "Offline", value: offline, icon: <NoWifiIcon color="#E7000B" /> },
      { title: "Desatualizados", value: desatualizados, icon: <AlertIcon color="#BB4D00" /> },
      { title: "Total", value: terminais.length, icon: <TerminalIcon color="#155DFC" /> },
    ];
  }, [terminais]);

  const getStatusProps = (status: ITerminal["status"]) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "default";
      case "desatualizado":
        return "warning";
      case "erro":
        return "error";
      case "manutencao":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: ITerminal["status"]) => {
    switch (status) {
      case "online":
        return <WifiIcon color={theme.palette.success.contrastText} width={16} height={16} />;
      case "offline":
        return <NoWifiIcon color={theme.palette.default.contrastText} width={16} height={16} />;
      case "desatualizado":
        return <AlertIcon color={theme.palette.warning.contrastText} width={16} height={16} />;
      case "erro":
        return <ErrorOutlineIcon width={16} height={16} />;
      case "manutencao":
        return <ConfiguracoesIcon color={theme.palette.default.contrastText} width={16} height={16} />;
    }
  };

  const handleToggle = async (terminal: ITerminal) => {
    try {
      const response = await fetch(`/api/terminais/${terminal.id}/toggle-status`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Erro ao alterar status" }));
        throw new Error(data.message || "Erro ao alterar status");
      }
      await loadTerminais();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status do terminal");
    }
  };

  const handleToggleManutencao = async (terminal: ITerminal) => {
    try {
      const response = await fetch(`/api/terminais/${terminal.id}/manutencao`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Erro ao alterar status" }));
        throw new Error(data.message || "Erro ao alterar status");
      }
      await loadTerminais();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status do terminal");
    }
  };

  const handleSaveEdit = async (data: CreateTerminalSchemaFormData) => {
    if (!selectedTerminal) return;
    try {
      const response = await fetch(`/api/terminais/${selectedTerminal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          unidade_id: Number(data.unidadeId),
          tipo: data.tipo,
          refeicoes_permitidas: data.refeicoesPermitidas.map(Number),
          categorias_permitidas: data.categoriasPermitidas,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Erro ao salvar terminal");
      }
      await loadTerminais();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar terminal");
    }
  };

  return (
    <>
      <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'} >
        <Box>
          <Typography variant="h6" fontWeight={'400'}>Terminais Cadastrados</Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={'400'}
          >
            Gerencie os terminais de acesso às refeições
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{
            fontWeight: '400',
            paddingY: 1.5
          }}
          onClick={() => setOpenNewTerminalModal(true)}
        >
          Novo Terminal
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
      >
        {stats.map((card, i) => (
          <Card key={i} flexDirection="row" alignItems="center" gap={0} paddingY={1.5}>
            <IconBox
              icon={card.icon}
              bgColor={'transparent'}
              padding={2}
              maxWidth='fit-content'
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
      {terminais.map((terminal) => (
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
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ position: "relative", top: -4 }}
                  >
                    ({terminal.uid.slice(0, 8)})
                  </Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {terminal.unidadeNome} • {terminal.tipo}
                </Typography>
                <Stack direction="row" alignItems="center" marginTop={0.5} spacing={0}>
                  {getStatusIcon(terminal.status)}
                  <Chip
                    label={terminal.status}
                    color={getStatusProps(terminal.status)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 12,
                      "& .MuiChip-label": { padding: 0 },
                      mx: 0.5,
                      textTransform: "capitalize",
                      mr: 2
                    }}
                  />
                  <ClockIcon color={theme.palette.text.secondary} width={16} height={16} />
                  <Typography variant="caption" color="text.secondary" ml={0.5}>
                    Último ping: {terminal.ultimoPing ? formatDate(new Date(terminal.ultimoPing), "dd/MM/yyyy, hh:mm:ss") : "nunca"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} height="fit-content">
              {terminal.status === "desatualizado" &&
                <Chip label={"Revisar Configurações"} size="small" color="warning" />
              }
              <Tooltip
                title={
                  terminal.status === "manutencao"
                    ? "Retirar de manutenção (volta como offline)"
                    : "Colocar em manutenção"
                }
                arrow
              >
                <IconButton
                  type="button"
                  aria-label="Alternar manutenção"
                  size="small"
                  onClick={() => handleToggleManutencao(terminal)}
                  sx={{
                    ml: "auto",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    color: terminal.status === "manutencao" ? "warning.contrastText" : "default.contrastText",
                  }}
                >
                  <ConfiguracoesIcon width={20} />
                </IconButton>
              </Tooltip>
              <ActionCell
                checked={terminal.ativo}
                tooltipToggle="Ativar/Desativar terminal"
                onToggle={() => handleToggle(terminal)}
                tooltipEdit="Editar terminal"
                onEdit={() => {
                  setSelectedTerminal(terminal)
                  setOpenEditTerminalModal(true)
                }}
              />
            </Stack>

          </Stack>
          <Stack direction="row" gap={2}>
            <Stack flex={1}>
              <Typography variant="body2" color="text.secondary">
                Refeições Permitidas:
              </Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                {terminal.refeicoesPermitidas.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">Nenhuma</Typography>
                ) : terminal.refeicoesPermitidas.map((ref) => (
                  <Chip key={ref} label={ref} size="small" color="info" />
                ))}
              </Stack>
            </Stack>
            <Stack flex={1}>
              <Typography variant="body2" color="text.secondary">
                Categorias Permitidas:
              </Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                {terminal.categoriasPermitidas.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">Nenhuma</Typography>
                ) : terminal.categoriasPermitidas.map((cat) => (
                  <Chip key={cat} label={cat} size="small" color="purple" />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      ))}
      <NewTerminalModal
        open={openNewTerminalModal}
        onClose={() => setOpenNewTerminalModal(false)}
        onCreated={loadTerminais}
      />
      {selectedTerminal && (
        <EditTerminalModal
          open={openEditTerminalModal}
          onClose={() => setOpenEditTerminalModal(false)}
          terminal={selectedTerminal}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
