"use client";

import { Stack, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import { ReportSectionProps } from "./interface";

/**
 * Bloco nomeado de um relatório (`<section>` + `<h2>` de verdade), pra que
 * resumo, gráfico e tabela sejam navegáveis por landmark/heading em vez de
 * serem só caixas soltas na tela.
 */
export function ReportSection({ id, title, description, meta, action, plain = false, children }: ReportSectionProps) {
  const headingId = `${id}-titulo`;

  const header = (
    <Stack direction="row" gap={1} alignItems="baseline" justifyContent="space-between" flexWrap="wrap">
      <Stack direction="row" gap={1} alignItems="baseline" flexWrap="wrap">
        <Typography id={headingId} component="h2" variant="body1" fontWeight={600}>
          {title}
        </Typography>
        {meta && (
          <Typography variant="body2" color="text.secondary">
            {meta}
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  );

  if (plain) {
    return (
      <Stack component="section" aria-labelledby={headingId} gap={1.5}>
        {header}
        {description && (
          <Typography variant="body2" color="text.secondary" mt={-1}>
            {description}
          </Typography>
        )}
        {children}
      </Stack>
    );
  }

  return (
    <Card component="section" aria-labelledby={headingId}>
      {header}
      {description && (
        <Typography variant="body2" color="text.secondary" mt={-1}>
          {description}
        </Typography>
      )}
      {children}
    </Card>
  );
}
