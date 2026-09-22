"use client";

import React from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import { ReportFilterPanelProps } from "./interface";

/**
 * Filtros como pílulas numa linha só, com "Gerar Relatório" à direita.
 *
 * É o `ReportAppliedFilters` em versão editável: mesmo card, mesmo rótulo em
 * versalete e as mesmas pílulas — só que aqui elas abrem e mudam o recorte,
 * e o canto direito traz o botão no lugar do "gerado em". Escolher e conferir
 * o recorte passam a ter a mesma forma, uma linha embaixo da outra.
 *
 * É a alternativa enxuta ao `ReportFilterBar`: sem legenda de grupo, sem
 * chips removíveis e sem desfazer. O botão não depende de ter alteração
 * pendente — ele regera o relatório também com o mesmo recorte, que é o que
 * o nome promete.
 */
export function ReportFilterPanel({
  children,
  dateIssue = null,
  isLoading = false,
  onApply,
}: ReportFilterPanelProps) {
  return (
    <Card
      component="form"
      aria-label="Filtros do relatório"
      spacing={1.5}
      sx={{ paddingX: 2.25, paddingY: 1.75, borderRadius: 4 }}
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        if (!dateIssue) onApply();
      }}
    >
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.5}>
        <Typography
          variant="caption"
          component="h2"
          fontWeight={600}
          color="grey.500"
          textTransform="uppercase"
          letterSpacing="0.72px"
        >
          Filtros
        </Typography>

        {children}

        <Box
          sx={{
            marginLeft: { sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={Boolean(dateIssue) || isLoading}
            sx={{
              height: 32,
              borderRadius: 9999,
              paddingX: 2,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Gerar Relatório
          </Button>
        </Box>
      </Stack>

      {dateIssue && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={dateIssue.onFix}>
              {dateIssue.actionLabel}
            </Button>
          }
        >
          {dateIssue.message}
        </Alert>
      )}
    </Card>
  );
}
