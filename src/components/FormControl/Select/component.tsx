import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import { SelectGProps } from "./";

export default function SelectG<T>({
  label = "",
  optional = true,
  options,
  formControlSx,
  selectSx,
  register,
}: SelectGProps<T>) {
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
        {...register}
        defaultValue={options[0]?.value}
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
