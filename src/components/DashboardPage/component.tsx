"use client";

import { Button, Stack, Typography, Grid, Box } from "@mui/material";
import { DashBoardPageProps, ModuleCard, Last7DaysChart } from "./index";
import { DownloadIcon, ArrowIcon, FileIcon, CSVIcon } from "../Icons";
import { CardapiosIcon, RefeicoesIcon, EstoqueIcon, RelatoriosIcon, UsuariosIcon } from "../Sidebar/icons";
import React from "react";
import { CardGeneric, ModalGeneric, IconBox } from "../Generics";

const modules = [
  {
    title: "Cardápios",
    subtitle: "Acesse o módulo",
    link: "/cardapios",
    icon: <CardapiosIcon color="#155DFC" />,
    iconBgColor: "#EFF6FF",
  },
  {
    title: "Estoque",
    subtitle: "Acesse o módulo",
    link: "/estoque",
    icon: <EstoqueIcon color="#9810FA" />,
    iconBgColor: "#FAF5FF",
  },
  {
    title: "Refeições",
    subtitle: "Acesse o módulo",
    link: "/refeicoes",
    icon: <RefeicoesIcon color="#009689" />,
    iconBgColor: "#F0FDFA",
  },
  {
    title: "Relatórios",
    subtitle: "Acesse o módulo",
    link: "/relatorios",
    icon: <RelatoriosIcon color="#EC003F" />,
    iconBgColor: "#FFF1F2",
  },
  {
    title: "Usuários",
    subtitle: "Acesse o módulo",
    link: "/usuarios",
    icon: <UsuariosIcon color="#E17100" />,
    iconBgColor: "#FFBEB",
  },
];

export function DashBoardPage({ }: DashBoardPageProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Stack gap={2}>

      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography variant="h1" fontWeight={"600"} color="text.primary">
            Dashboard Operacional
          </Typography>
          <Typography variant="body1" color="text.secondary"  >
            Visão geral das operações do dia
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => setOpen(true)}
        >
          Exportar
        </Button>

        <ModalGeneric
          open={open}
          onClose={() => setOpen(false)}
          title="Exportar Relatório"
          subtitle="Escolha o formato de exportação"
        >
          <Stack gap={2}>
            <Stack direction={"row"} gap={2} border={"3px solid"} borderColor={"divider"} borderRadius={3} padding={2}>
              <IconBox
                icon={<FileIcon color="#FF0070" />}
                bgColor="#ff00701a"
                padding={2}
                borderRadius={3}
              />
              <Box component="span">
                <Typography variant="body1" color="text.primary">
                  PDF
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Relatório completo com gráficos e métricas
                </Typography>
              </Box>
            </Stack>

            <Stack direction={"row"} gap={2} border={"3px solid"} borderColor={"divider"} borderRadius={3} padding={2}>
              <IconBox
                icon={<CSVIcon color="#198754" />}
                bgColor="#B8EBAD"
                padding={2}
                borderRadius={3}
              />
              <Box component="span">
                <Typography variant="body1" color="text.primary">
                  CSV
                </Typography>
                <Typography variant="body2" color="text.secondary" >
                  Dados em formato de tabela separada por vírgulas
                </Typography>
              </Box>
            </Stack>

            <Stack direction={"row"} gap={2}>
              <Button
                variant="outlined"
                sx={{
                  flex: 1,
                  fontSize: "1.2rem",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "text.secondary",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
                onClick={() => { }}
              >
                Visualizar
              </Button>
              <Button
                sx={{
                  flex: 1,
                  fontSize: "1.2rem",
                }}
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => { }}
              >
                Baixar
              </Button>
            </Stack>
          </Stack>
        </ModalGeneric>

      </Stack>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
      >
        {modules.map((module, i) => (
          <ModuleCard
            key={i}
            icon={module.icon}
            iconBgColor={module.iconBgColor}
            title={module.title}
            subtitle={module.subtitle}
            link={module.link}
          />
        ))}
      </Box>

      <CardGeneric>
        <Typography variant="body1" fontWeight="400" color="text.primary">
          Sem alertas críticos
        </Typography>
        <Typography variant="body2" fontWeight="400" color="text.secondary">
          Nenhum item atingiu o ponto de alerta.
        </Typography>
      </CardGeneric>

      <Stack direction={"row"} gap={2}>
        <CardGeneric>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box component="span">
              <Typography variant="body1" fontWeight="400" color="text.primary">
                Refeições Previstas
              </Typography>
              <Typography variant="body2" color="text.secondary"  >
                Ainda sem dados
              </Typography>
            </Box>
            <IconBox
              icon={<RefeicoesIcon color="#009689" />}
              bgColor="#F0FDFA"
              padding={2}
              borderRadius={3}
            />
          </Stack>
          <Typography variant="h3" fontWeight="400" color="text.primary">–</Typography>
        </CardGeneric>
        <CardGeneric>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box component="span">
              <Typography variant="body1" fontWeight="400" color="text.primary">
                Refeições Servidas
              </Typography>
              <Typography variant="body2" fontWeight="400" color="text.secondary">
                Ainda sem dados
              </Typography>
            </Box>
            <IconBox
              icon={<RefeicoesIcon color="#155DFC" />}
              bgColor="#EFF6FF"
              padding={2}
              borderRadius={3}
            />
          </Stack>
          <Typography variant="h3" fontWeight="400" color="text.primary">–</Typography>
        </CardGeneric>
      </Stack>

      <Stack direction={"row"} flexWrap="wrap" gap={2}>
        <CardGeneric>
          <Stack
            direction={"row"}
            borderBottom={"1px solid"}
            borderColor={"divider"}
            justifyContent={"space-between"}
            paddingBottom={2}
            gap={2}
          >
            <Box component="span">
              <Typography variant="body1" fontWeight="400" color="text.primary">
                Cardápio do Dia
              </Typography>
              <Typography variant="body2" fontWeight="400" color="text.secondary">
                03/12/2025
              </Typography>
            </Box>
            <Typography
              variant="body1"
              fontWeight="500"
              color="primary.main"
              gap={0.5}
              sx={{
                display: "inline-flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Ver Cardápio Completo
              <ArrowIcon color="primary.main" />
            </Typography>
          </Stack>
          <Stack component="span" padding={3} alignItems={"center"}>
            <Typography variant="body2" fontWeight="400" color="text.secondary" >
              Nenhum cardápio programado
            </Typography>
          </Stack>
        </CardGeneric>

        <CardGeneric>
          <Stack
            direction={"row"}
            borderBottom={"1px solid"}
            borderColor={"divider"}
            justifyContent={"space-between"}
            paddingBottom={2}
            gap={2}
          >
            <Typography variant="body1" fontWeight="400" color="text.primary">
              Alertas de Estoque
            </Typography>
            <Typography variant="body2" fontWeight="400" color="text.secondary">
              0 itens
            </Typography>
          </Stack>
          <Stack component="span" padding={3} alignItems={"center"}>
            <Typography variant="body2" fontWeight="400" color="text.secondary" >
              Nenhum cardápio programado
            </Typography>
            <Typography
              variant="body2"
              fontWeight="400"
              color="primary.main"
              sx={{
                display: "inline-flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Ver Estoque Completo
            </Typography>
          </Stack>
        </CardGeneric>

        <CardGeneric>
          <Typography
            variant="body1"
            fontWeight="400"
            color="text.primary"
            borderBottom={"1px solid"}
            borderColor={"divider"}
            paddingBottom={2}
          >
            Últimos 7 Dias
          </Typography>
          <Last7DaysChart />
        </CardGeneric>
      </Stack>
    </Stack>
  );
}
