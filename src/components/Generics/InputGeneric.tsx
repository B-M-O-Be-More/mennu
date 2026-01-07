import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

interface InputGenericProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  optional?: boolean;
  placeholder?: string;
  sx?: SxProps<Theme>;
  icon?: React.ReactNode;
}

export default function InputGeneric
  ({
    value,
    onChange,
    label,
    optional = true,
    placeholder = "Buscar...",
    sx,
    icon,
  }: InputGenericProps) {
  return (
    <FormControl fullWidth>
      {label && (
        <Typography
          variant="body2"
          mb={1} color="text.label" fontWeight={400}
        >
          {label}{" "}
          {!optional && (
            <Typography variant="body2" component="span" color="primary.main">*</Typography>
          )}
        </Typography>
      )}
      <OutlinedInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            {icon && icon}
          </InputAdornment>
        }
        sx={{
          borderRadius: 3,
          fontSize: 14,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            transition: "border-color 0.2s ease",
          },
          "& input::placeholder": {
            color: "text.secondary",
            opacity: 0.8,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            "& .MuiInputAdornment-root svg": {
              color: "primary.main",
              transition: "all 0.2s ease",
              transform: "scale(1.2) rotate(12deg)",
            },
          },
          ...sx,
        }}
      />
    </FormControl>
  );
}
