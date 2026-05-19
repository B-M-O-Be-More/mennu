"use client";

import { Button, Stack, IconButton, Tooltip } from "@mui/material";

import { MenuPageProps, PeriodFormFields, PeriodFilter } from "./interface";
import PageHeader from "../PageHeader";
import { CalendarIcon, CookHatIcon, CopyIcon, PaperIcon, PlusIcon, StatsIcon } from "../Icons";
import React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/pt-br";
import { ptBR } from "@mui/x-date-pickers/locales";
import CloseIcon from "@mui/icons-material/Close";
import TabButton from "../TabButton";
import MenusTab from "./Tabs/MenusTab";
import ItemsTab from "./Tabs/ItemsTab";
import ConsumptionTab from "./Tabs/ConsumptionTab";
import ReportsTab from "./Tabs/ReportsTab";


import NewMenuModal from "../Modals/NewMenuModal";
import NewMenuItemModal from "../Modals/NewMenuItemModal";
import NewManualRegisterModal from "../Modals/NewManualRegisterModal";

const brLocaleText = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

const tabs = [
  { label: "Cardápios", icon: <CalendarIcon height={24} /> },
  { label: "Itens", icon: <CookHatIcon height={24} /> },
  { label: "Consumo", icon: <PaperIcon height={24} /> },
  { label: "Relatórios", icon: <StatsIcon height={24} /> },
];

export function MenuPage({}: MenuPageProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [openCreateMenuModal, setOpenCreateMenuModal] = React.useState(false);
  const [openCreateMenuItemModal, setOpenCreateMenuItemModal] = React.useState(false);
  const [openManualRegisterModal, setOpenManualRegisterModal] = React.useState(false);
  const [periodFilter, setPeriodFilter] = React.useState<PeriodFilter>(null);

  const { control, reset, setValue } = useForm<PeriodFormFields>({
    defaultValues: { start: null, end: null },
  });

  const start = useWatch({ control, name: "start" });
  const end = useWatch({ control, name: "end" });

  React.useEffect(() => {
    if (start && end && start.isAfter(end)) {
      setValue("end", null);
      setPeriodFilter(null);
      return;
    }

    if (start && end) {
      setPeriodFilter({ start, end });
    } else {
      setPeriodFilter(null);
    }
  }, [start, end, setValue]);

  const handleClearPeriod = () => {
    reset({ start: null, end: null });
    setPeriodFilter(null);
  };

  const compactDatePickerSx = {
    width: "145px !important", 
    "& .MuiInputBase-root": {
      height: "40px !important", 
      minHeight: "40px !important", 
      borderRadius: "8px !important",
      fontSize: "14px !important",
      backgroundColor: "background.paper",
    },
    "& .MuiOutlinedInput-input": {
      padding: "0 10px !important", 
      height: "40px !important",
      boxSizing: "border-box !important",
      display: "flex !important",
      alignItems: "center !important",
    },
    "& .MuiInputAdornment-root": {
      marginLeft: "0px !important", 
      "& .MuiIconButton-root": {
        padding: "6px !important", 
      },
      "& svg": {
        width: "22px !important", 
        height: "22px !important", 
        color: "#4B5563 !important", 
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E5E7EB",
    },
  };

  return (
    <Stack gap={2}>
      <PageHeader title="Cardápios" subtitle="Gerencie os cardápios das refeições">
        {activeTab === 0 && (
          <React.Fragment>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => {}}
            >
              Copiar
            </Button>

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={brLocaleText}
            >
              <Stack direction="row" gap={1} alignItems="center">
                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          placeholder: "De",
                          sx: compactDatePickerSx,
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
                      value={field.value}
                      onChange={field.onChange}
                      minDate={start ?? undefined}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          placeholder: "Até",
                          sx: compactDatePickerSx,
                        },
                      }}
                    />
                  )}
                />
                
                {periodFilter && (
                  <Tooltip title="Limpar período">
                    <IconButton 
                      onClick={handleClearPeriod} 
                      sx={{ 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        height: '40px', 
                        width: '40px',
                        color: '#4B5563', 
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          backgroundColor: '#F3F4F6'
                        }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: "22px" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </LocalizationProvider>

            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenCreateMenuModal(true)}
            >
              Novo Cardápio
            </Button>

            <NewMenuModal
              open={openCreateMenuModal}
              onClose={() => setOpenCreateMenuModal(false)}
            />
          </React.Fragment>
        )}

        {activeTab === 1 && (
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenCreateMenuItemModal(true)}
            >
              Novo Item
            </Button>
            <NewMenuItemModal
              open={openCreateMenuItemModal}
              onClose={() => setOpenCreateMenuItemModal(false)}
            />
          </React.Fragment>
        )}

        {activeTab === 2 && (
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenManualRegisterModal(true)}
            >
              Registro Manual
            </Button>
            <NewManualRegisterModal
              open={openManualRegisterModal}
              onClose={() => setOpenManualRegisterModal(false)}
            />
          </React.Fragment>
        )}

        {activeTab === 3 && (
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => {}}
            >
              Exportar CSV
            </Button>
          </React.Fragment>
        )}
      </PageHeader>

      <Stack direction="row" gap={2} sx={{ overflowX: "auto" }}>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            label={tab.label}
            icon={tab.icon}
            tabIndex={index}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        ))}
      </Stack>

      {activeTab === 0 && <MenusTab periodFilter={periodFilter} />}
      {activeTab === 1 && <ItemsTab />}
      {activeTab === 2 && <ConsumptionTab />}
      {activeTab === 3 && <ReportsTab />}
    </Stack>
  );
}
