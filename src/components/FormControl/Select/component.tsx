import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { SelectGProps } from "./";


export default function SelectG({
  label = "",
  optional = true,
  options,
  error,
  formControlSx,
  selectSx,
  name,
  control,
  register,
  defaultValue = "",
}: SelectGProps) {
  return (
    <FormControl fullWidth sx={{ ...formControlSx }}>
      {label && (
        <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
          {label}{" "}
          {!optional && (
            <Typography variant="body2" component="span" color="primary.main">
              *
            </Typography>
          )}
        </Typography>
      )}

      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const currentValue = field.value ?? "";
            const hasOption = options.some(
              (opt: { label: string; value: string; disabled?: boolean }) =>
                String(opt.value) === String(currentValue),
            );

            return (
            <Select
              {...field}
              value={hasOption ? currentValue : ""}
              sx={{
                width: "100%",
                fontSize: 14,
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                  transition: "border-color 0.1s ease",
                },
                height: "100%",
                ...selectSx,
              }}>
              {options.map((opt: { label: string; value: string; disabled?: boolean }, idx: number) => (
                <MenuItem
                  key={`${opt.value}-${idx}`}
                  value={opt.value}
                  disabled={Boolean(opt.disabled)}
                  sx={{ fontSize: 12 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            );
          }}
        />
      ) : (
        <Select
          {...register}
          defaultValue={defaultValue}
          sx={{
            width: "100%",
            fontSize: 14,
            borderRadius: 3,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
              transition: "border-color 0.1s ease",
            },
            height: "100%",
            ...selectSx
          }}
        >
          {options.map((opt: { label: string; value: string; disabled?: boolean }, idx: number) => (
            <MenuItem
              key={`${opt.value}-${idx}`}
              value={opt.value}
              disabled={Boolean(opt.disabled)}
              sx={{ fontSize: 12 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      )}

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}
        ml={1.6}
      >
        {error}
      </Typography>
    </FormControl>
  );
}