"use client";

import Card from "@/components/Cards/Card";
import { CheckboxGroupProps } from "./interface";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function CheckboxGroup({
  label,
  sublabel,
  optional = true,
  options,
  error,
  name,
  control,
}: CheckboxGroupProps) {
  return (
    <FormGroup>
      {label && (
        <Stack direction={"row"} flexWrap={"wrap"}>
          <Typography
            variant="body2"
            mb={1}
            color="text.label"
            fontWeight={400}>
            {label}{" "}
            {!optional && (
              <Typography variant="body2" component="span" color="primary.main">
                *
              </Typography>
            )}
          </Typography>
          {sublabel && (
            <Typography
              variant="subtitle2"
              fontWeight={400}
              marginLeft={0.5}
              color="text.secondary">
              {sublabel}
            </Typography>
          )}
        </Stack>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const values: string[] = field.value || [];

          return (
            <Stack gap={1} direction="row" sx={{ flexWrap: "wrap" }}>
              {options.map((option) => {
                const checked = values.includes(option.id);
                return (
                  <Card
                    variant="compact"
                    sx={{ minWidth: { xs: "100%", sm: "auto" } }}
                    key={option.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="medium"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...values, option.id]);
                            } else {
                              field.onChange(
                                values.filter((v) => v !== option.id),
                              );
                            }
                          }}
                        />
                      }
                      slotProps={{
                        typography: {
                          fontSize: { xs: "0.875rem", sm: "0.9rem" },
                        },
                      }}
                      label={option.label}
                    />
                  </Card>
                );
              })}
            </Stack>
          );
        }}
      />

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}>
        {error}
      </Typography>
    </FormGroup>
  );
}
