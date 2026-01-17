import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import { SelectGProps } from "./interface";

export default function SelectG<T>({
  label = "",
  optional = true,
  onChange,
  options,
  register,
  error,
}: SelectGProps<T>) {
  return (
    <FormControl fullWidth>
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

      <Select
        defaultValue={String(options[0]?.value)}
        onChange={(e) => onChange?.(e.target.value as T)}
        {...register}
        sx={{
          width: "100%",
          fontSize: 14,
          borderRadius: 3,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            transition: "border-color 0.1s ease",
          },
          height: "57px",
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={String(opt.value)}
            value={String(opt.value)}
            sx={{ fontSize: 14 }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="caption" color={error ? "error.contrastText" : "transparent"} >
        {error}
      </Typography>
    </FormControl>
  );
}
