"use client";

import * as React from "react";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, type FieldValues } from "react-hook-form";
import type { SelectOption } from "@/components/FormControl/Select/interface";
import type { SearchableSelectProps } from "./interface";

export default function SearchableSelect<
  TFieldValues extends FieldValues,
>({
  name,
  control,
  options,
  error,
  placeholder = "Selecione ou busque uma opção",
  loading = false,
  disabled = false,
  noOptionsText = "Nenhuma opção encontrada",
  loadingText = "Carregando opções...",
  formControlSx,
}: SearchableSelectProps<TFieldValues>) {
  return (
    <FormControl fullWidth sx={formControlSx}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue =
            field.value === undefined || field.value === null
              ? ""
              : String(field.value);
          const selectedOption =
            options.find((option) => option.value === currentValue) ?? null;

          return (
            <Autocomplete<SelectOption, false, false, false>
              autoHighlight
              handleHomeEndKeys
              openOnFocus
              disabled={disabled}
              loading={loading}
              options={options}
              value={selectedOption}
              onChange={(_, newValue) =>
                field.onChange(newValue?.value ?? "")
              }
              onBlur={field.onBlur}
              getOptionDisabled={(option) => Boolean(option.disabled)}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              noOptionsText={noOptionsText}
              loadingText={loadingText}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 0.5,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 8px 24px rgba(16, 24, 40, 0.08)",
                  },
                },
                listbox: {
                  sx: {
                    p: 0.5,
                    "& .MuiAutocomplete-option": {
                      borderRadius: 2,
                      fontSize: 14,
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  placeholder={placeholder}
                  error={Boolean(error)}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                    htmlInput: {
                      ...params.inputProps,
                      name: field.name,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 56,
                      borderRadius: 3,
                      fontSize: 14,
                      "& fieldset": {
                        borderColor: "divider",
                        transition: "border-color 0.2s ease",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-error fieldset": {
                        borderColor: "error.contrastText",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "grey.50",
                      },
                    },
                  }}
                />
              )}
            />
          );
        }}
      />

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}
        sx={{ mt: "3px", mx: "14px" }}
      >
        {error}
      </Typography>
    </FormControl>
  );
}
