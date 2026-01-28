import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import { SelectGProps } from "./";
import { Controller } from "react-hook-form";

export default function SelectG<T>({
  value,
  onChange,
  label = "",
  optional = true,
  options,
  formControlSx,
  selectSx,
  name,
  control,
}: SelectGProps<T>) {
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
          render={({ field }) => (
            <Select
              {...field}
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
              {options.map((opt: { label: string; value: string }) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ fontSize: 12 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      ) : (
        <Select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          defaultValue={options[0]?.value}
          sx={{
            width: "100%",
            ...selectSx,
            fontSize: 14,
            borderRadius: 3,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
              transition: "border-color 0.1s ease",
            },
            height: "57px",
          }}>
          {options.map((opt) => (
            <MenuItem
              key={String(opt.value)}
              value={String(opt.value)}
              sx={{ fontSize: 14 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
}
