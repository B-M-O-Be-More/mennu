"use client";

import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import PageHeader from "../PageHeader";
import Card from "../Cards/Card";
import IconBox from "../Cards/IconBox";
import { ArrowIcon, ArrowHeadIcon } from "../Icons";
import { usePermissions } from "@/hooks/usePermissions/hook";
import { PermissionCode } from "@/Interfaces/ProfilePermissions/profilePermissions";
import { REPORTS_CATALOG, BESPOKE_REPORTS } from "@/data/reportsCatalog";
import ReportViewer from "./ReportViewer";
import DashboardTab from "./Tabs/DashboardTab";
import ConsumptionHistoryTab from "./Tabs/ConsumptionHistoryTab";
import EstoqueReportView from "./EstoqueReportView";
import GerencialReportView from "./GerencialReportView";
import ConsumoReportView from "./ConsumoReportView";

interface ReportCard {
  slug: string;
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  iconBgColor: string;
  permission: PermissionCode;
}

export function ReportsPage() {
  const { can } = usePermissions();
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);

  const cards: ReportCard[] = React.useMemo(() => {
    const genericCards = REPORTS_CATALOG.map((entry) => ({
      slug: entry.slug,
      titulo: entry.titulo,
      descricao: entry.descricao,
      icon: entry.icon,
      iconBgColor: entry.iconBgColor,
      permission: entry.permission,
    }));
    return [...genericCards, ...BESPOKE_REPORTS].filter((card) => can(card.permission));
  }, [can]);

  const selectedGeneric = selectedSlug ? REPORTS_CATALOG.find((entry) => entry.slug === selectedSlug) : undefined;
  const selectedCard = selectedSlug ? cards.find((card) => card.slug === selectedSlug) : undefined;

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        {selectedSlug && (
          <IconButton
            aria-label="Voltar para Relatórios"
            onClick={() => setSelectedSlug(null)}
            sx={{ ml: -1, mt: 0.5, color: "text.primary" }}
          >
            <ArrowIcon style={{ transform: "rotate(180deg)" }} width={24} height={24} />
          </IconButton>
        )}
        <Box flex={1} minWidth={0}>
          <PageHeader
            title={selectedCard ? selectedCard.titulo : "Relatórios"}
            subtitle={selectedCard ? selectedCard.descricao : "Relatórios disponíveis para o seu plano"}
          />
        </Box>
      </Stack>

      {!selectedSlug ? (
        <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
          {cards.map((card) => (
            <Card
              key={card.slug}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
              }}
              onClick={() => setSelectedSlug(card.slug)}
            >
              <IconBox icon={card.icon} bgColor={card.iconBgColor} padding={2} borderRadius={3} />
              <Box component="span">
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {card.titulo}
                </Typography>
                <Typography variant="body2" fontWeight={400} color="text.secondary" mt={0.5}>
                  {card.descricao}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" gap={0.5} color="primary.main" fontSize={12} fontWeight={500}>
                Abrir relatório
                <ArrowHeadIcon width={12} height={12} style={{ transform: "rotate(-90deg)" }} />
              </Stack>
            </Card>
          ))}

          {cards.length === 0 && (
            <Typography color="text.secondary">Nenhum relatório disponível para o seu perfil.</Typography>
          )}
        </Box>
      ) : selectedGeneric ? (
        <ReportViewer entry={selectedGeneric} />
      ) : selectedSlug === "refeicoes-dashboard" ? (
        <DashboardTab />
      ) : selectedSlug === "refeicoes-historico" ? (
        <ConsumptionHistoryTab />
      ) : selectedSlug === "estoque" ? (
        <EstoqueReportView />
      ) : selectedSlug === "gerencial" ? (
        <GerencialReportView />
      ) : selectedSlug === "consumo" ? (
        <ConsumoReportView />
      ) : null}
    </Stack>
  );
}
