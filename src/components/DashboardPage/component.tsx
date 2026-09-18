"use client";

import { Alert, Button, Stack, Typography, Box, Chip, CircularProgress } from "@mui/material";
import { DashBoardPageProps } from "./index";
import { DownloadIcon, ArrowIcon, FileIcon, RefeicoesIcon, AlertIcon } from "../Icons";
import React from "react";
import { useRouter } from "next/navigation";
import { cardsModules } from "@/data/infos";
import ModuleCard from "../ModuleCard";
import Last7DaysChart from "../Charts/Last7DaysChart";
import IconBox from "../Cards/IconBox";
import Card from "../Cards/Card";
import PageHeader from "../PageHeader";
import ExportModal from "../Modals/ExportModal";
import { IDashboardOperacional, mapApiDashboardToUi } from "@/Interfaces/Dashboard/dashboard";

function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function exportDashboard() {
  window.open("/api/dashboard/operacional/exportar", "_blank", "noopener,noreferrer");
}

export function DashBoardPage({ }: DashBoardPageProps) {
  const router = useRouter();
  const [openExportReport, setOpenExportReport] = React.useState(false);
  const [dashboard, setDashboard] = React.useState<IDashboardOperacional | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/operacional");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar o dashboard");
      }
      setDashboard(mapApiDashboardToUi(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar o dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const chartData = (dashboard?.ultimos7Dias ?? []).map((dia) => ({
    label: dia.diaSemana,
    value: dia.totalRefeicoes,
  }));

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
            onPreview: exportDashboard,
            onDownload: exportDashboard,
          },
        ]}
      />

      {error && <Alert severity="error">{error}</Alert>}

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

      {isLoading ? (
        <Stack alignItems="center" padding={4}>
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <>
          <Card>
            <Typography variant="body1" fontWeight="400" color="text.primary">
              {dashboard && dashboard.alertasCriticos > 0
                ? `${dashboard.alertasCriticos} alerta(s) crítico(s)`
                : "Sem alertas críticos"}
            </Typography>
            <Typography variant="body2" fontWeight="400" color="text.secondary">
              {dashboard && dashboard.alertasCriticos > 0
                ? "Itens de estoque atingiram o ponto de alerta."
                : "Nenhum item atingiu o ponto de alerta."}
            </Typography>
          </Card>

          <Stack direction={"row"} gap={2}>
            <Card>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Box component="span">
                  <Typography variant="body1" fontWeight="400" color="text.primary">
                    Refeições Previstas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboard ? formatDateOnly(dashboard.dataReferencia) : "Ainda sem dados"}
                  </Typography>
                </Box>
                <IconBox
                  icon={<RefeicoesIcon color="#009689" />}
                  bgColor="#F0FDFA"
                  padding={2}
                  borderRadius={3}
                />
              </Stack>
              <Typography variant="h4" fontWeight="400" color="text.primary">
                {dashboard ? dashboard.refeicoesPrevistas : "–"}
              </Typography>
            </Card>
            <Card>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Box component="span">
                  <Typography variant="body1" fontWeight="400" color="text.primary">
                    Refeições Servidas
                  </Typography>
                  <Typography variant="body2" fontWeight="400" color="text.secondary">
                    {dashboard ? formatDateOnly(dashboard.dataReferencia) : "Ainda sem dados"}
                  </Typography>
                </Box>
                <IconBox
                  icon={<RefeicoesIcon color="#155DFC" />}
                  bgColor="#EFF6FF"
                  padding={2}
                  borderRadius={3}
                />
              </Stack>
              <Typography variant="h4" fontWeight="400" color="text.primary">
                {dashboard ? dashboard.refeicoesServidas : "–"}
              </Typography>
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
                    {dashboard ? formatDateOnly(dashboard.dataReferencia) : ""}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  fontWeight="500"
                  color="primary.main"
                  gap={0.5}
                  onClick={() => router.push("/cardapios")}
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
              {!dashboard || dashboard.cardapioDoDia.length === 0 ? (
                <Stack component="span" padding={3} alignItems={"center"}>
                  <Typography variant="body2" fontWeight="400" color="text.secondary">
                    Nenhum cardápio programado
                  </Typography>
                </Stack>
              ) : (
                <Stack gap={1} paddingTop={1}>
                  {dashboard.cardapioDoDia.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">{item.tipoRefeicaoNome}</Typography>
                      <Stack direction="row" gap={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {item.numeroPrevistoRefeicoes} previstas
                        </Typography>
                        <Chip label={item.status} size="small" sx={{ textTransform: "capitalize" }} />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
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
                  {dashboard ? `${dashboard.alertasEstoque.length} itens` : "0 itens"}
                </Typography>
              </Stack>
              {!dashboard || dashboard.alertasEstoque.length === 0 ? (
                <Stack component="span" padding={3} alignItems={"center"}>
                  <Typography variant="body2" fontWeight="400" color="text.secondary">
                    Nenhum item em alerta
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="400"
                    color="primary.main"
                    onClick={() => router.push("/estoque")}
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
              ) : (
                <Stack gap={1} paddingTop={1}>
                  {dashboard.alertasEstoque.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        {item.critico && <AlertIcon width={16} height={16} color="#E7000B" />}
                        <Typography variant="body2">{item.nome}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantidadeAtual} / {item.pontoReposicao}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
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
              <Last7DaysChart data={chartData} />
            </Card>
          </Stack>
        </>
      )}
    </Stack>
  );
}
