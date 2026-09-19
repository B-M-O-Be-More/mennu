"use client";

import { Alert, AlertTitle, Button, Stack } from "@mui/material";
import { ReportErrorStateProps } from "./interface";

/** Falha de carga com saída: tentar de novo sem perder o recorte atual. */
export function ReportErrorState({ message, onRetry, isRetrying = false, secondaryAction }: ReportErrorStateProps) {
  return (
    <Alert
      severity="error"
      role="alert"
      action={
        <Stack direction="row" gap={1}>
          {secondaryAction && (
            <Button color="inherit" size="small" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {onRetry && (
            <Button color="inherit" size="small" onClick={onRetry} disabled={isRetrying}>
              {isRetrying ? "Tentando…" : "Tentar novamente"}
            </Button>
          )}
        </Stack>
      }
    >
      <AlertTitle>Não foi possível carregar os dados</AlertTitle>
      {message}
    </Alert>
  );
}
