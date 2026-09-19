"use client";

import React from "react";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { CSVIcon, DownloadIcon, PaperIcon } from "@/components/Icons";
import { ReportExportMenuProps } from "./interface";

const FORMAT_ICON = {
  csv: <CSVIcon color="#00A63E" height={18} width={18} />,
  pdf: <PaperIcon color="#FF0070" height={18} width={18} />,
};

/**
 * Exportar em 1 formato: botão simples, baixa direto (0 clique extra).
 * Em 2+ formatos: 1 clique abre o menu, 1 clique baixa — 2 cliques ao
 * todo. Sem "Visualizar" no meio: a tela por trás já é o preview (cards
 * e gráfico já carregados), então pedir pra abrir um modal igual antes de
 * baixar só duplicava clique sem duplicar informação.
 */
export function ReportExportMenu({ formats, disabled = false, label = "Exportar", size = "medium" }: ReportExportMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const download = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
    setAnchorEl(null);
  };

  if (formats.length <= 1) {
    const only = formats[0];
    return (
      <Button
        variant="outlined"
        size={size}
        startIcon={<DownloadIcon height={18} />}
        disabled={disabled || !only}
        onClick={() => only && download(only.href)}
      >
        {only ? only.label : label}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        size={size}
        startIcon={<DownloadIcon height={18} />}
        endIcon={<KeyboardArrowDown />}
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {formats.map((format) => (
          <MenuItem key={format.formato} onClick={() => download(format.href)}>
            <ListItemIcon>{FORMAT_ICON[format.formato]}</ListItemIcon>
            <ListItemText>{format.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
