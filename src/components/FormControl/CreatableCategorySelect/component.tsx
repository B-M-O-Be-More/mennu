"use client";

import * as React from "react";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import { Controller, type FieldValues } from "react-hook-form";
import { useStockCategoryOptions } from "@/hooks/useStockCategoryOptions/hook";
import type { CreatableCategorySelectProps } from "./interface";

interface CategoryOption {
  label: string;
  value: string;
  inputValue?: string;
  isNew?: boolean;
}

const filter = createFilterOptions<CategoryOption>({
  stringify: (option) => option.value,
});

function normalizeCategory(value: string) {
  return value.trim();
}

function getCategoryValue(
  option: CategoryOption | string | null | undefined,
) {
  if (typeof option === "string") return option;

  return option?.inputValue ?? option?.value ?? option?.label ?? "";
}

export default function CreatableCategorySelect<
  TFieldValues extends FieldValues,
>({
  name,
  control,
  enabled,
  error,
  optional = true,
  disabled = false,
}: CreatableCategorySelectProps<TFieldValues>) {
  const { categoryOptions, isLoadingCategories, categoriesError } =
    useStockCategoryOptions(enabled);

  const options = React.useMemo<CategoryOption[]>(
    () =>
      categoryOptions.map((category) => ({
        label: category,
        value: category,
      })),
    [categoryOptions],
  );

  return (
    <FormControl fullWidth>
      <Stack direction="row" alignItems="center" mb={1}>
        <Typography variant="body2" color="text.label" fontWeight={400}>
          Categoria{" "}
          <Typography
            variant="body2"
            component="span"
            color={!optional ? "primary.main" : "transparent"}
          >
            *
          </Typography>
        </Typography>
      </Stack>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue =
            typeof field.value === "string" ? field.value : "";
          const selectedOption =
            options.find(
              (option) =>
                option.value.toLocaleLowerCase("pt-BR") ===
                currentValue.toLocaleLowerCase("pt-BR"),
            ) ??
            (currentValue
              ? { label: currentValue, value: currentValue }
              : null);

          return (
            <Autocomplete<CategoryOption, false, false, true>
              freeSolo
              clearOnBlur={false}
              selectOnFocus
              handleHomeEndKeys
              disabled={disabled}
              loading={isLoadingCategories}
              options={options}
              value={selectedOption}
              onChange={(_, newValue) => {
                if (typeof newValue === "string") {
                  field.onChange(normalizeCategory(newValue));
                  return;
                }

                if (!newValue) {
                  field.onChange("");
                  return;
                }

                field.onChange(
                  normalizeCategory(getCategoryValue(newValue)),
                );
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === "input") {
                  field.onChange(newInputValue);
                }
              }}
              onBlur={() => {
                field.onChange(normalizeCategory(currentValue));
                field.onBlur();
              }}
              filterOptions={(availableOptions, params) => {
                const filtered = filter(availableOptions, params);
                const candidate = normalizeCategory(params.inputValue);
                const alreadyExists = availableOptions.some(
                  (option) =>
                    option.value.toLocaleLowerCase("pt-BR") ===
                    candidate.toLocaleLowerCase("pt-BR"),
                );

                if (candidate && !alreadyExists) {
                  filtered.push({
                    label: `Criar "${candidate}"`,
                    value: candidate,
                    inputValue: candidate,
                    isNew: true,
                  });
                }

                return filtered;
              }}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : option.inputValue ?? option.label
              }
              isOptionEqualToValue={(option, value) =>
                getCategoryValue(option).toLocaleLowerCase("pt-BR") ===
                getCategoryValue(value).toLocaleLowerCase("pt-BR")
              }
              noOptionsText="Nenhuma categoria encontrada"
              loadingText="Carregando categorias..."
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={`${option.isNew ? "new" : "existing"}-${option.value}`}
                >
                  {option.label}
                </li>
              )}
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
                  placeholder="Selecione ou crie uma categoria"
                  error={Boolean(error)}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isLoadingCategories ? (
                            <CircularProgress color="inherit" size={18} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                    htmlInput: {
                      ...params.inputProps,
                      name: field.name,
                      maxLength: 100,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
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
                    },
                  }}
                />
              )}
            />
          );
        }}
      />

      {(error || categoriesError) && (
        <Typography
          variant="caption"
          color={error ? "error.contrastText" : "warning.dark"}
          sx={{ mt: "3px", mx: "14px" }}
        >
          {error ?? categoriesError}
        </Typography>
      )}
    </FormControl>
  );
}
