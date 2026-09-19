"use client";

import React from "react";
import { Button, Checkbox, FormControlLabel, Menu, Stack, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { ReportColumnsMenuProps } from "./interface";

/**
 * "Colunas" — liga campos que a tabela padrão esconde (ex.: divergência em
 * valor, motivo de uma movimentação). Fica de fora do fluxo de filtro:
 * não muda os dados, só o que aparece deles, então marca/desmarca aplica
 * na hora, sem "Aplicar" — mexer aqui não custa uma nova requisição.
 */
export function ReportColumnsMenu({ visibility }: ReportColumnsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { definitions, isVisible, toggle } = visibility;

  if (definitions.length === 0) return null;

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<KeyboardArrowDown />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
      >
        Colunas
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { p: 1 } } }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ px: 1, display: "block", mb: 0.5 }}>
          Colunas extras
        </Typography>
        <Stack>
          {definitions.map((def) => (
            <FormControlLabel
              key={def.key}
              sx={{ mx: 0 }}
              control={<Checkbox size="small" checked={isVisible(def.key)} onChange={() => toggle(def.key)} />}
              label={<Typography variant="body2">{def.label}</Typography>}
            />
          ))}
        </Stack>
      </Menu>
    </>
  );
}
