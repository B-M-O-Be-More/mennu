"use client";

import { Stack, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import { ReportAppliedFiltersProps } from "./interface";

/**
 * Faixa de leitura do recorte que gerou os números, logo acima dos cards.
 *
 * Diferente dos chips do `ReportFilterBar`, aqui nada é removível e todo
 * campo do relatório aparece — inclusive o que está sem valor ("Categoria:
 * Todas") — porque a faixa responde "estes números são de quê?", e um campo
 * omitido deixaria essa resposta pela metade.
 */
export function ReportAppliedFilters({
  pills,
  generatedAt = null,
}: ReportAppliedFiltersProps) {
  return (
    <Card
      component="section"
      aria-label="Recorte aplicado"
      spacing={0}
      sx={{ paddingX: 2.25, paddingY: 1.75, borderRadius: 4 }}
    >
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1.5}>
        <Typography
          variant="caption"
          fontWeight={600}
          color="grey.500"
          textTransform="uppercase"
          letterSpacing="0.72px"
        >
          Filtros
        </Typography>

        {pills.map((pill) => (
          <Stack
            key={pill.key}
            direction="row"
            alignItems="center"
            gap={0.75}
            height={26}
            paddingX={1.25}
            borderRadius={9999}
            bgcolor="grey.100"
            color="grey.700"
            maxWidth="100%"
            minWidth={0}
          >
            {pill.icon}
            <Typography variant="caption" fontWeight={500} noWrap>
              {pill.label}
            </Typography>
          </Stack>
        ))}

        {generatedAt && (
          <Typography
            variant="caption"
            color="grey.400"
            sx={{ marginLeft: { sm: "auto" } }}
          >
            gerado em {generatedAt.format("DD/MM/YYYY HH:mm")}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
