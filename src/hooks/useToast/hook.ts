import React from "react";
import { AlertColor } from "@mui/material";

export interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  duration: number;
}

export type NotifyFn = (
  message: string,
  severity?: AlertColor,
  duration?: number,
) => void;

export function useToast() {
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
    duration: 3000,
  });

  const showToast = React.useCallback<NotifyFn>(
    (message, severity = "info", duration = 3000) => {
      setToast({ open: true, message, severity, duration });
    },
    [],
  );

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return { toast, showToast, closeToast };
}
