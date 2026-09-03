"use client";

import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { SelectGProps, SelectOption } from "./interface";

const PROMPT_VALUES = ["", "__select__"];

function isPromptOption(option?: SelectOption) {
  if (!option) return false;
  return (
    PROMPT_VALUES.includes(String(option.value)) ||
    /^selecione/i.test(option.label)
  );
}

function resolveValue(raw: unknown, options: SelectOption[]) {
  const current = raw === undefined || raw === null ? "" : String(raw);
  const match = options.find((opt) => String(opt.value) === current);
  if (match) return String(match.value);

  const firstEnabled = options.find((opt) => !opt.disabled);
  return firstEnabled ? String(firstEnabled.value) : "";
}

export default function SelectG({
  label = "",
  labelIcon,
  optional = true,
  options,
  error,
  description,
  icon,
  disabled = false,
  formControlSx,
  selectSx,
  value,
  onChange,
  name,
  control,
  register,
}: SelectGProps) {
  const startAdornment = icon ? (
    <InputAdornment position="start">{icon}</InputAdornment>
  ) : undefined;

  const renderSelect = (props: SelectProps, currentValue: string) => {
    const selectedOption = options.find(
      (opt) => String(opt.value) === currentValue,
    );

    return (
      <Select
        {...props}
        disabled={disabled}
        displayEmpty
        error={!!error}
        startAdornment={startAdornment}
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
            list: {
              sx: {
                p: 0.5,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
              },
            },
          },
        }}
        sx={{
          width: "100%",
          fontSize: 14,
          borderRadius: 3,
          color: isPromptOption(selectedOption)
            ? "text.secondary"
            : "text.primary",
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
          "&.Mui-focused .MuiInputAdornment-positionStart svg": {
            color: "primary.main",
            transition: "all 0.2s ease",
            transform: "scale(1.2) rotate(12deg)",
          },
          "& .MuiSelect-icon": {
            color: "text.secondary",
            transition: "color 0.2s ease",
          },
          "&.Mui-focused .MuiSelect-icon": {
            color: "primary.main",
          },
          "&.Mui-disabled": {
            bgcolor: "grey.50",
          },
          ...selectSx,
        }}>
        {options.map((opt, idx) => (
          <MenuItem
            key={`${opt.value}-${idx}`}
            value={opt.value}
            disabled={Boolean(opt.disabled)}
            sx={{
              fontSize: 14,
              borderRadius: 2,
              px: 1.5,
              py: 1,
              color: isPromptOption(opt) ? "text.secondary" : "text.primary",
              transition: "background-color 0.2s ease, color 0.2s ease",
              "&:hover": {
                bgcolor: "background.default",
              },
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "primary.light",
                },
              },
            }}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    );
  };

  return (
    <FormControl fullWidth sx={{ ...formControlSx }}>
      {label && (
        <Stack
          direction={"row"}
          gap={1}
          sx={{
            "& svg": {
              width: 18,
              height: 20,
            },
          }}>
          {labelIcon}
          <Typography
            variant="body2"
            mb={1}
            color="text.label"
            fontWeight={400}>
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
            value: resolveValue(value, options),
            onChange: (event) => onChange?.(String(event.target.value)),
          },
          resolveValue(value, options),
        )
      ) : control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const currentValue = resolveValue(field.value, options);
            return renderSelect({ ...field, value: currentValue }, currentValue);
          }}
        />
      ) : (
        renderSelect(
          { ...register, defaultValue: resolveValue(undefined, options) },
          resolveValue(undefined, options),
        )
      )}

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
