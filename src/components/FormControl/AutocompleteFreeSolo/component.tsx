"use client";

import {
  Autocomplete,
  CircularProgress,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { AutocompleteFreeSoloProps } from "./interface";

export default function AutocompleteFreeSolo({
  label,
  labelIcon,
  optional = true,
  placeholder,
  options,
  loading = false,
  error,
  description,
  disabled = false,
  name,
  control,
}: AutocompleteFreeSoloProps) {
  return (
    <FormControl fullWidth>
      {label && (
        <Stack
          direction={"row"}
          gap={1}
          sx={{
            "& svg": {
              width: 18,
              height: 20,
            },
          }}
        >
          {labelIcon}
          <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
            {label}{" "}
            <Typography
              variant="body2"
              component="span"
              color={!optional ? "primary.main" : "transparent"}
              sx={{ transition: "all 0.2s ease-in-out" }}
            >
              *
            </Typography>
          </Typography>
        </Stack>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            freeSolo
            disabled={disabled}
            options={options}
            loading={loading}
            value={field.value ?? ""}
            onChange={(_, newValue) => field.onChange(newValue ?? "")}
            onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                variant="outlined"
                error={!!error}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
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
                    "& input::placeholder": {
                      color: "text.secondary",
                      opacity: 0.8,
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
        )}
      />

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}
        sx={{ mt: "3px", mx: "14px" }}
      >
        {error}
      </Typography>

      {description && (
        <Typography variant="caption" fontWeight={400} color="text.secondary" mt={1}>
          {description}
        </Typography>
      )}
    </FormControl>
  );
}
