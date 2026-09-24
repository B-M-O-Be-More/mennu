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
  minDate,
  maxDate,
  size = "medium",
  labelPosition = "top",
}: DatePickerProps) {
  const labelEl = (
    <Typography variant="body2" mb={labelPosition === "top" ? 1 : 0} mt={labelPosition === "bottom" ? 0.5 : 0} color="text.label" fontWeight={400}>
      {label}
    </Typography>
  );

  return (
    <Stack width={"100%"}>
      {labelPosition === "top" && labelEl}
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={brLocaleText}
      >
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <DatePicker
              value={field.value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(e) => field.onChange(e)}
              slotProps={{
                field: {
                  readOnly: true,
                },
                popper: {
                  sx: {
                    "& .MuiPickersArrowSwitcher-button:not(.Mui-disabled)": {
                      color: "text.secondary",
                      opacity: 1,
                    },
                  },
                },
                textField: {
                  size,
                  error: Boolean(fieldState.error),
                  helperText: fieldState.error?.message,
                  FormHelperTextProps: {
                    role: "alert",
                  },
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
      {labelPosition === "bottom" && labelEl}
    </Stack>
  );
}
