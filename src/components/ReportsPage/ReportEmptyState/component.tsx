"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import { FilterIcon } from "@/components/Icons";
import { ReportEmptyStateProps } from "./interface";

/** Vazio com saída — filtrar demais não pode virar tela morta. */
export function ReportEmptyState({
  title = "Sem resultados para os filtros atuais",
  description = "Nenhum registro atende ao recorte selecionado. Amplie o período ou remova um filtro.",
  icon,
  actions = [],
}: ReportEmptyStateProps) {
  return (
    <Card sx={{ border: "1px dashed", borderColor: "divider", alignItems: "center", textAlign: "center", py: 8, gap: 1.5 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 4,
          bgcolor: "background.default",
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon ?? <FilterIcon width={24} height={24} />}
      </Box>

      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={440}>
        {description}
      </Typography>

      {actions.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" mt={0.5}>
          {actions.map((action) => (
            <Button key={action.label} size="small" variant={action.variant ?? "outlined"} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Card>
  );
}
