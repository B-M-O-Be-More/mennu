import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";
import { InputProps } from "./";
import React from "react";
import { FiEye } from "react-icons/fi";

export default function Input({
  value,
  onChange,
  label,
  optional = true,
  placeholder = "Buscar...",
  sx,
  icon,
  type = "text",
  error,
  register,
}: InputProps) {
  const isRHF = register
  const [showPassword, setShowPassword] = React.useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <FormControl fullWidth>
      {label && (
        <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
          {label}{" "}
          <Typography
            variant="body2"
            component="span"
            color={!optional ? "primary.main" : "transparent"}
            sx={{ transition: "all 0.2s ease-in-out" }}>
            *
          </Typography>
        </Typography>
      )}

      <OutlinedInput
        type={inputType}
        placeholder={placeholder}
        {...(isRHF
          ? register
          : {
              value: value,
              onChange: (e) => onChange?.(e.target.value),
            })}
        startAdornment={
          <InputAdornment position="start">
            {type === "password" ? (
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="start"
                size="small">
                {showPassword ? <FiEye /> : icon}
              </IconButton>
            ) : (
              icon
            )}
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

      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}>
        {error}
      </Typography>
    </FormControl>
  );
}
