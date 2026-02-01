import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import { TerminalsTabProps } from "./interface";
import { AlertIcon, ClockIcon, NoWifiIcon, PlusIcon, TerminalIcon, WifiIcon } from "@/components/Icons";
import React from "react";
import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import { cardsTerminalsConfig } from "@/data/infos";
import ActionCell from "@/components/ActionCell";
import NewTerminalModal from "@/components/Modals/NewTerminalModal";
import EditTerminalModal from "@/components/Modals/EditTerminalModal/Component";
import { ITerminal } from "@/Interfaces/Terminal/terminal";

export const mockTerminals: ITerminal[] = [
  {
    id: "1",
    nome: "Terminal A",
    codigo: "TRM-001",
    unidade: "Unidade 1",
    tipo: "Principal",
    status: "online",
    ultimaSync: "04/12/2025 14:30:22",
    refeicoesPermitidas: ["Café da Manhã", "Almoço", "Jantar"],
    categoriasPermitidas: ["Funcionários", "Visitantes"],
    ativo: true,
  },
  {
    id: "2",
    nome: "Terminal B",
    codigo: "TRM-002",
    unidade: "Unidade 2",
    tipo: "Secundário",
    status: "offline",
    ultimaSync: "03/12/2025 09:15:10",
    refeicoesPermitidas: ["Almoço", "Jantar"],
    categoriasPermitidas: ["Funcionários"],
    ativo: false,
  },
  {
    id: "3",
    nome: "Terminal C",
    codigo: "TRM-003",
    unidade: "Unidade 3",
    tipo: "Principal",
    status: "desatualizado",
    ultimaSync: "03/12/2025 09:15:10",
    refeicoesPermitidas: ["Jantar"],
    categoriasPermitidas: ["Gestor"],
    ativo: false,
  },
];

export default function TerminalsTab({ }: TerminalsTabProps) {
  const theme = useTheme();
  const [openNewTerminalModal, setOpenNewTerminalModal] = React.useState(false);
  const [openEditTerminalModal, setOpenEditTerminalModal] = React.useState(false);

  const [selectedTerminal, setSelectedTerminal] = React.useState<ITerminal>({} as ITerminal);

  const getStatusProps = (status: ITerminal["status"]) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "default";
      case "desatualizado":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <WifiIcon color={theme.palette.success.contrastText} width={16} height={16} />;
      case "offline":
        return <NoWifiIcon color={theme.palette.default.contrastText} width={16} height={16} />;
      case "desatualizado":
        return <AlertIcon color={theme.palette.warning.contrastText} width={16} height={16} />;
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
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
      >
        {cardsTerminalsConfig.map((card, i) => (
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
      {mockTerminals.map((terminal) => (
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
                    ({terminal.codigo})
                  </Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {terminal.unidade} • {terminal.tipo}
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
                    Última sync: {terminal.ultimaSync}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} height="fit-content">
              {terminal.status === "desatualizado" &&
                <Chip label={"Revisar Configurações"} size="small" color="warning" />
              }
              <ActionCell
                checked={terminal.ativo}
                onToggle={(checked) => console.log("Toggle terminal:", terminal.nome, checked)}
                onEdit={() => {
                  setSelectedTerminal(terminal)
                  setOpenEditTerminalModal(true)
                }}
                sxProps={{ ml: "auto" }}
              />
            </Stack>

          </Stack>
          <Stack direction="row" gap={2}>
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
            <Stack flex={1}>
              <Typography variant="body2" color="text.secondary">
                Categorias Permitidas:
              </Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                {terminal.categoriasPermitidas.map((ref) => (
                  <Chip key={ref} label={ref} size="small" color="purple" />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      ))}
      <NewTerminalModal
        open={openNewTerminalModal}
        onClose={() => setOpenNewTerminalModal(false)}
      />
      <EditTerminalModal
        open={openEditTerminalModal}
        onClose={() => setOpenEditTerminalModal(false)}
        terminal={selectedTerminal}
        onSave={() => { }}
      />
    </>
  );
}