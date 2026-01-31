"use client";

import { Button, Stack, Typography, Grid, Box } from "@mui/material";
import { DashBoardPageProps } from "./index";
import { DownloadIcon, ArrowIcon, FileIcon, CSVIcon } from "../Icons";
import { RefeicoesIcon } from "../Sidebar/icons";
import React from "react";
import { cardsModules } from "@/data/infos";
import ModuleCard from "../ModuleCard";
import Last7DaysChart from "../Last7DaysChart";
import IconBox from "../Cards/IconBox";
import Card from "../Cards/Card";
import PageHeader from "../PageHeader";
import ExportModal from "../Modals/ExportModal";

export function DashBoardPage({ }: DashBoardPageProps) {
  const [openExportReport, setOpenExportReport] = React.useState(false);

  return (
    <Stack gap={2}>
      <PageHeader
        title="Dashboard Operacional"
        subtitle="Visão geral das operações do dia"
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => setOpenExportReport(true)}
        >
          Exportar
        </Button>
      </PageHeader>

      <ExportModal
        open={openExportReport}
        onClose={() => setOpenExportReport(false)}
        title="Exportar Relatório"
        subtitle="Escolha o formato de exportação"
        options={[
          {
            label: "PDF",
            description: "Relatório completo com gráficos e métricas",
            icon: <FileIcon color="#FF0070" />,
            bgColor: "#ff00701a",
            onPreview: () => { console.log("Preview PDF"); },
            onDownload: () => { console.log("Download PDF"); },
          },
          {
            label: "CSV",
            description: "Dados em formato de tabela separada por vírgulas",
            icon: <CSVIcon color="#198754" />,
            bgColor: "#B8EBAD",
            onPreview: () => { console.log("Preview CSV"); },
            onDownload: () => { console.log("Download CSV"); },
          },
        ]}
      />

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
      >
        {cardsModules.map((module, i) => (
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

      <Card>
        <Typography variant="body1" fontWeight="400" color="text.primary">
          Sem alertas críticos
        </Typography>
        <Typography variant="body2" fontWeight="400" color="text.secondary">
          Nenhum item atingiu o ponto de alerta.
        </Typography>
      </Card>

      <Stack direction={"row"} gap={2}>
        <Card>
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
          <Typography variant="h4" fontWeight="400" color="text.primary">–</Typography>
        </Card>
        <Card>
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
          <Typography variant="h4" fontWeight="400" color="text.primary">–</Typography>
        </Card>
      </Stack>

      <Stack direction={"row"} flexWrap="wrap" gap={2}>
        <Card>
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
        </Card>

        <Card>
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
        </Card>

        <Card>
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
        </Card>
      </Stack>
    </Stack>
  );
}
