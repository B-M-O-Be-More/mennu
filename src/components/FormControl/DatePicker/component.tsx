import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import { ptBR } from "@mui/x-date-pickers/locales";
import { Stack, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePickerProps } from "./interface";

const brLocaleText =
  ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

export default function DatePickerG({
  label,
  name,
  control,
}: DatePickerProps) {
  return (
    <Stack width={"100%"}>
      <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
        {label}
      </Typography>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={brLocaleText}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(e) => field.onChange(e)}
              disableFuture
              slotProps={{
                field: {
                  readOnly: true,
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}
