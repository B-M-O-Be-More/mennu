import { Stack, Typography } from "@mui/material";
import { TimePickerProps } from "./interface";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { ptBR } from "@mui/x-date-pickers/locales";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller } from "react-hook-form";

const brLocaleText =
  ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

export default function TimePickerG({
  label,
  labelIcon,
  name,
  control,
}: TimePickerProps) {
  return (
    <Stack width={"100%"}>
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
        <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
          {label}
        </Typography>
      </Stack>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={brLocaleText}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <TimePicker
              value={field.value ?? null}
              onChange={(e) => field.onChange(e)}
              slotProps={{
                field: {
                  readOnly: true,
                },
                textField: {
                  helperText: fieldState.error?.message,
                  fullWidth: true,
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}
