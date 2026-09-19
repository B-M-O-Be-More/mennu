"use client";

import { Chip, Stack } from "@mui/material";
import { ReportPeriodPresetsProps } from "./interface";
import { DEFAULT_PERIOD_PRESETS } from "./presets";

/**
 * Atalho de 1 clique pros recortes de período mais comuns — aplica na
 * hora (não passa pelo rascunho/Aplicar), porque preset é uma decisão
 * já completa, diferente de mexer no calendário campo a campo.
 */
export function ReportPeriodPresets({ dataInicio, dataFim, onSelect, presets = DEFAULT_PERIOD_PRESETS }: ReportPeriodPresetsProps) {
  return (
    <Stack direction="row" gap={0.75} flexWrap="wrap" role="group" aria-label="Atalhos de período">
      {presets.map((preset) => {
        const { dataInicio: inicio, dataFim: fim } = preset.build();
        const isActive = Boolean(dataInicio && dataFim && dataInicio.isSame(inicio, "day") && dataFim.isSame(fim, "day"));
        return (
          <Chip
            key={preset.label}
            label={preset.label}
            size="small"
            clickable
            color={isActive ? "primary" : "default"}
            variant={isActive ? "filled" : "outlined"}
            onClick={() => onSelect(inicio, fim)}
          />
        );
      })}
    </Stack>
  );
}
