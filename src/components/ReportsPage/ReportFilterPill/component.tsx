"use client";

import React from "react";
import { Box, MenuItem, Select, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";
import { CalendarIcon } from "@/components/Icons";
import {
  ReportPillDateProps,
  ReportPillOption,
  ReportPillSelectProps,
} from "./interface";

const brLocaleText = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

/**
 * A pílula clicável do painel de filtros — mesma casca das pílulas de leitura
 * do `ReportAppliedFilters`, para escolher o recorte e conferir o recorte
 * terem a mesma forma.
 *
 * Único desvio da faixa: 32px de altura no lugar de 26px. A faixa é só
 * leitura; aqui a pílula é alvo de clique e de toque.
 */
const PILL_SX = {
  height: 32,
  borderRadius: 9999,
  bgcolor: "grey.100",
  color: "grey.700",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.15px",
  maxWidth: "100%",
};

const PILL_MENU_PROPS = {
  disableScrollLock: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  slotProps: {
    paper: {
      elevation: 0,
      sx: {
        mt: 0.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 8px 24px rgba(16, 24, 40, 0.08)",
        maxHeight: 320,
      },
    },
    list: { sx: { p: 0.5, display: "flex", flexDirection: "column", gap: 0.25 } },
  },
} as const;

/**
 * Primeira palavra da opção "sem filtro": "Todas as categorias" vira
 * "Todas", que com o prefixo já diz tudo ("Categoria: Todas").
 */
function allWord(options: ReportPillOption[]) {
  return options[0]?.label.split(" ")[0] ?? "Todos";
}

/** O texto da pílula é o mesmo da faixa de recorte. */
export function pillText(
  options: ReportPillOption[],
  value: string,
  prefix?: string,
) {
  const isUnset = !value || value === "all";
  const label = isUnset
    ? allWord(options)
    : options.find((option) => option.value === value)?.label ?? value;

  return prefix ? `${prefix}: ${label}` : label;
}

/**
 * As opções chegam por rede (unidades, tipos de refeição, insumos…): até
 * elas carregarem o valor guardado não casa com nenhuma, e o MUI reclamaria
 * de valor fora da lista.
 */
function resolveValue(options: ReportPillOption[], value: string) {
  if (options.some((option) => option.value === value)) return value;
  return options[0]?.value ?? "";
}

export function ReportPillSelect({
  value,
  options,
  onChange,
  prefix,
  icon,
  ariaLabel,
}: ReportPillSelectProps) {
  const current = resolveValue(options, value);

  return (
    <Select
      variant="standard"
      displayEmpty
      value={current}
      onChange={(event) => onChange(String(event.target.value))}
      inputProps={{ "aria-label": ariaLabel }}
      MenuProps={PILL_MENU_PROPS}
      renderValue={() => (
        <Stack direction="row" alignItems="center" gap={0.75} minWidth={0}>
          {icon}
          <Box
            component="span"
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {pillText(options, current, prefix)}
          </Box>
        </Stack>
      )}
      sx={{
        ...PILL_SX,
        paddingLeft: 1.25,
        // `standard` traz as linhas de baixo do input; a pílula não as tem.
        "&::before, &::after": { display: "none" },
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          minHeight: 0,
          paddingY: 0,
          paddingRight: "26px !important",
          "&:focus": { backgroundColor: "transparent" },
        },
        "& .MuiSelect-icon": { right: 6, fontSize: 18, color: "grey.500" },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} sx={{ fontSize: 14, borderRadius: 2 }}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

/** Ícone do calendário na mesma medida das pílulas da faixa. */
function PillCalendarIcon() {
  return <CalendarIcon width={12} height={12} />;
}

/**
 * O campo de data do X v8 não é um `OutlinedInput`: ele monta o DOM acessível
 * com `PickersOutlinedInput` e uma lista de seções, que traz classes próprias
 * (`MuiPickersOutlinedInput-*`, `MuiPickersInputBase-*`) e paddings próprios.
 * Os seletores clássicos ficam junto como reserva, caso o campo um dia volte
 * ao `TextField` comum.
 */
const DATE_PILL_SX = {
  "& .MuiPickersOutlinedInput-root, & .MuiOutlinedInput-root": {
    ...PILL_SX,
    gap: 0.75,
    paddingX: 1.25,
    cursor: "pointer",
  },
  "& .MuiPickersOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  // Sem isso sobram os 8.5px verticais do tamanho `small`, e a pílula estica.
  "& .MuiPickersInputBase-sectionsContainer, & .MuiOutlinedInput-input": {
    padding: 0,
    cursor: "pointer",
  },
  "& .MuiInputAdornment-root": { margin: 0 },
};

export function ReportPillDate({
  value,
  onChange,
  minDate,
  maxDate,
  ariaLabel,
}: ReportPillDateProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={brLocaleText}
    >
      <DatePicker
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slots={{ openPickerIcon: PillCalendarIcon }}
        slotProps={{
          // Calendário à esquerda do texto, como na pílula de período da faixa.
          inputAdornment: { position: "start" },
          openPickerButton: { size: "small", sx: { padding: 0, color: "grey.700" } },
          field: { readOnly: true },
          textField: {
            size: "small",
            // A pílula inteira abre o calendário, não só o ícone.
            onClick: () => setOpen(true),
            inputProps: { "aria-label": ariaLabel },
            sx: DATE_PILL_SX,
          },
        }}
      />
    </LocalizationProvider>
  );
}
