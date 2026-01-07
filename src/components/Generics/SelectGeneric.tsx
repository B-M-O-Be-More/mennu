import { FormControl, Select, MenuItem, SxProps, Theme, Typography } from "@mui/material";

interface SelectGenericProps<T> {
  label?: string;
  optional?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  formControlSx?: SxProps<Theme>;
  selectSx?: SxProps<Theme>;
}

export default function SelectGeneric<T>({
  label = "",
  optional = true,
  value,
  onChange,
  options,
  formControlSx,
  selectSx,
}: SelectGenericProps<T>) {
  return (
    <FormControl fullWidth sx={{ ...formControlSx, }} >
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
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        sx={{
          width: "100%", ...selectSx, fontSize: 14, borderRadius: 3, "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            transition: "border-color 0.1s ease"
          },
          height: "57px"
        }}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)} sx={{ fontSize: 14 }}>
            {opt.label}
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  );
}
