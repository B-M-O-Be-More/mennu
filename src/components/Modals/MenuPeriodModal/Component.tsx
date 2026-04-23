"use client";

import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Stack 
} from "@mui/material";
import { useForm } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuPeriodModalProps } from "./interface";
import { Dayjs } from "dayjs";
import { Controller } from "react-hook-form";

interface FormData {
  start: Dayjs | null;
  end: Dayjs | null;
}

export default function MenuPeriodModal({ open, onClose, onApply }: MenuPeriodModalProps) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { 
      start: null, 
      end: null 
    }
  });

  const onSubmit = (data: FormData) => {
    onApply(data);
    onClose();
  };

  const handleClose = () => {
    reset(); 
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Selecionar Período</DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} mt={1} pt={1}>
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Data Inicial"
                  value={field.value}
                  onChange={field.onChange}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              )}
            />
            <Controller
              name="end"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Data Final"
                  value={field.value}
                  onChange={field.onChange}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Aplicar Filtro
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}