import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Card from "@/components/Cards/Card";
import { ILogAuditStats } from "@/Interfaces/LogAudit/logAudit";
import { getLogAuditStatusConfig } from "./status";

type SummaryCardData = {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

function SummaryCard({ title, value, icon, iconBg }: SummaryCardData) {
  return (
    <Card spacing={0} sx={{ p: 0, minHeight: 138, justifyContent: "center" }}>
      <Stack direction="row" alignItems="center" spacing={2.25} sx={{ px: 3, py: 3.5 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: 2.5, bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 16, color: "text.secondary", lineHeight: 1.35 }}>{title}</Typography>
          <Typography sx={{ fontSize: 36, lineHeight: 1, fontWeight: 400 }}>{value}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export function LogAuditSummaryCards({ stats, isLoading }: { stats: ILogAuditStats; isLoading: boolean }) {
  const cards: SummaryCardData[] = [
    { title: "Total de Eventos", value: stats.total_eventos, icon: <ShieldOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />, iconBg: "#EFF6FF" },
    { title: "Sucessos", value: stats.total_sucessos, icon: getLogAuditStatusConfig("sucesso").statIcon, iconBg: getLogAuditStatusConfig("sucesso").statBg },
    { title: "Erros", value: stats.total_erros, icon: getLogAuditStatusConfig("erro").statIcon, iconBg: getLogAuditStatusConfig("erro").statBg },
    { title: "Avisos", value: stats.total_avisos, icon: getLogAuditStatusConfig("aviso").statIcon, iconBg: getLogAuditStatusConfig("aviso").statBg },
  ];

  return (
    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }}>
      {isLoading
        ? Array.from({ length: 4 }, (_, index) => (
            <Card key={index} sx={{ minHeight: 138, alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Card>
          ))
        : cards.map((card) => <SummaryCard key={card.title} {...card} />)}
    </Box>
  );
}
