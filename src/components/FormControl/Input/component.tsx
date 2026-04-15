import {
  FormControl,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import React from "react";
import { InputProps } from "./"; // Importação da sua interface (pode ser "./interface" se preferir)
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/Icons";

export default function Input({
  label,
  labelIcon,
  optional = true,
  placeholder = "Buscar...",
  sx,
  icon,
  type = "text",
  error,
  register,
  multiline = false,
  minRows = 3,
  description,
  disabled = false,
  value,
  onChange,
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const endAdornment =
    type === "password" ? (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
          size="small"
          tabIndex={-1}
          sx={{ color: "text.secondary" }}
        >
          {showPassword ? (
            <EyeOffIcon width={18} height={18} color="#6B7280" />
          ) : (
            <EyeIcon width={18} height={18} color="#6B7280" />
          )}
        </IconButton>
      </InputAdornment>
    ) : undefined;

  const startAdornment =
    type === "password" ? (
      <InputAdornment position="start">
        <LockIcon width={18} height={18} />
      </InputAdornment>
    ) : icon ? (
      <InputAdornment position="start">{icon}</InputAdornment>
    ) : undefined;

  return (
    <FormControl fullWidth>
      {label && (
        <Stack
          direction={"row"}
          gap={1}
          sx={{
            "& svg": {
              width: 18,
              height: 20,
            },
          }}
        >
          {labelIcon}
          <Typography
            variant="body2"
            mb={1}
            color="text.label"
            fontWeight={400}
          >
            {label}{" "}
            <Typography
              variant="body2"
              component="span"
              color={!optional ? "primary.main" : "transparent"}
              sx={{ transition: "all 0.2s ease-in-out" }}
            >
              *
            </Typography>
          </Typography>
        </Stack>
      )}

      <TextField
        variant="outlined"
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...register}
        multiline={multiline}
        minRows={multiline ? minRows : undefined}
        slotProps={{
          input: {
            disabled,
            startAdornment,
            endAdornment,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            fontSize: 14,
            "& fieldset": {
              borderColor: "divider",
              transition: "border-color 0.2s ease",
            },
            "& input::placeholder, & textarea::placeholder": {
              color: "text.secondary",
              opacity: 0.8,
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused .MuiInputAdornment-positionStart svg": {
              color: "primary.main",
              transition: "all 0.2s ease",
              transform: "scale(1.2) rotate(12deg)",
            },
            // Hack para remover o fundo cinza do Autofill do Navegador
            "& input:-webkit-autofill": {
              transition: "background-color 5000s ease-in-out 0s",
              WebkitTextFillColor: "inherit !important",
            },
          },
          "& .MuiFormHelperText-root.Mui-error": {
            color: "error.contrastText",
          },
          ...sx,
        }}
        error={!!error}
        helperText={error}
      />
      <Typography
        variant="caption"
        fontWeight={400}
        color="text.secondary"
        mt={1}
      >
        {description}
      </Typography>
    </FormControl>
  );
}