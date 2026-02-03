"use client";

import { Snackbar, Alert, AlertColor } from "@mui/material";
import { ToastProps } from "./";
import { AlertIcon, CircledCheckIcon, ErrorOutlineIcon } from "../Icons";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Toast({
  open,
  message,
  severity = "info",
  autoHideDuration = 3000,
  onClose,
}: ToastProps) {

  const getIcon = (severity: AlertColor) => {
    switch (severity) {
      case "success":
        return <CircledCheckIcon width={22} height={22} />;
      case "warning":
        return <AlertIcon width={22} height={22} />;
      case "error":
        return <ErrorOutlineIcon width={22} height={22} />;
      case "info":
      default:
        return <InfoOutlinedIcon width={22} height={22} />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="outlined"
        sx={{ width: "100%" }}
        icon={getIcon(severity)}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
