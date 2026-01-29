import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import { FiEye } from "react-icons/fi";
import { InputProps } from "./";

export default function Input({
  label,
  optional = true,
  placeholder = "Buscar...",
  sx,
  icon,
  type = "text",
  error,
  helperText,
  register,
}: InputProps) {
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
        {...register}
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
          height: "100%",
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
      {helperText && !error && (
        <Typography variant="body2" color={"text.secondary"}>
          {helperText}
        </Typography>
      )}
      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}>
        {error}
      </Typography>
    </FormControl>
  );
}
