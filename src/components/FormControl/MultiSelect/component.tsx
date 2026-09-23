"use client";

import {
  Checkbox,
  Chip,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { MultiSelectProps } from "./interface";

/**
 * Irmão do `Select` para campos que aceitam mais de um valor — mesma moldura,
 * mesmo menu, mesma marcação de obrigatório.
 *
 * É componente à parte, e não uma flag no `Select`, porque lá o valor é
 * sempre `string` e há dezenas de telas dependendo disso; aqui o valor é
 * `string[]` do início ao fim.
 */
export default function MultiSelect({
  label = "",
  labelIcon,
  optional = true,
  options,
  error,
  description,
  disabled = false,
  placeholder = "Selecione",
  formControlSx,
  selectSx,
  value,
  onChange,
  name,
  control,
  size = "medium",
}: MultiSelectProps) {
  /** Descarta valor que não está mais entre as opções (lista veio por rede). */
  const resolveValues = (raw: unknown): string[] => {
    if (!Array.isArray(raw)) return [];
    const known = new Set(options.map((option) => String(option.value)));
    return raw.map(String).filter((item) => known.has(item));
  };

  const labelFor = (optionValue: string) =>
    options.find((option) => String(option.value) === optionValue)?.label ??
    optionValue;

  const renderSelect = (props: SelectProps<string[]>, current: string[]) => (
    <Select
      {...props}
      multiple
      displayEmpty
      disabled={disabled}
      error={!!error}
      size={size}
      renderValue={() => {
        if (current.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary">
              {placeholder}
            </Typography>
          );
        }

        return (
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {current.map((item) => (
              <Chip key={item} label={labelFor(item)} size="small" />
            ))}
          </Stack>
        );
      }}
      MenuProps={{
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
      }}
      sx={{
        width: "100%",
        fontSize: 14,
        borderRadius: 3,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "divider",
          transition: "border-color 0.2s ease",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "primary.main",
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: "error.contrastText",
        },
        "& .MuiSelect-icon": {
          color: "text.secondary",
          transition: "color 0.2s ease",
        },
        "&.Mui-focused .MuiSelect-icon": { color: "primary.main" },
        "&.Mui-disabled": { bgcolor: "grey.50" },
        ...selectSx,
      }}
    >
      {options.map((option, index) => {
        const optionValue = String(option.value);

        return (
          <MenuItem
            key={`${optionValue}-${index}`}
            value={optionValue}
            disabled={Boolean(option.disabled)}
            sx={{
              fontSize: 14,
              borderRadius: 2,
              px: 1,
              py: 0.5,
              transition: "background-color 0.2s ease, color 0.2s ease",
              "&:hover": { bgcolor: "background.default" },
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": { bgcolor: "primary.light" },
              },
            }}
          >
            <Checkbox
              size="small"
              checked={current.includes(optionValue)}
              sx={{ p: 0.5, mr: 1, "&.Mui-checked": { color: "primary.main" } }}
            />
            <ListItemText
              primary={option.label}
              slotProps={{ primary: { fontSize: 14 } }}
            />
          </MenuItem>
        );
      })}
    </Select>
  );

  return (
    <FormControl fullWidth sx={{ ...formControlSx }}>
      {label && (
        <Stack
          direction={"row"}
          gap={1}
          sx={{ "& svg": { width: 18, height: 20 } }}>
          {labelIcon}
          <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
            {label}{" "}
            <Typography
              variant="body2"
              component="span"
              color={!optional ? "primary.main" : "transparent"}
              sx={{ transition: "all 0.2s ease-in-out" }}>
              *
            </Typography>
          </Typography>
        </Stack>
      )}

      {value !== undefined ? (
        renderSelect(
          {
            value: resolveValues(value),
            onChange: (event) =>
              onChange?.(resolveValues(event.target.value as string[])),
          },
          resolveValues(value),
        )
      ) : control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const current = resolveValues(field.value);
            return renderSelect(
              {
                ...field,
                value: current,
                onChange: (event) =>
                  field.onChange(resolveValues(event.target.value as string[])),
              },
              current,
            );
          }}
        />
      ) : null}

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}
        sx={{ mt: "3px", mx: "14px" }}>
        {error}
      </Typography>

      {description && (
        <Typography
          variant="caption"
          fontWeight={400}
          color="text.secondary"
          mt={1}>
          {description}
        </Typography>
      )}
    </FormControl>
  );
}
