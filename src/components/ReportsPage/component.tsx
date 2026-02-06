import { Button, Stack } from "@mui/material";
import PageHeader from "../PageHeader";
import { DownloadIcon, EyeIcon, UpdateIcon } from "../Icons";

const headerButtons = [
  {
    icon: <EyeIcon height={24} />,
    label: "Registrar Visualização",
    variant: "outlined" as const,
    onClick: () => console.log("registrar visualização"),
  },
  {
    icon: <UpdateIcon height={24} />,
    label: "Atualizar",
    variant: "outlined" as const,
    onClick: () => console.log("atualizar"),
  },
  {
    icon: <DownloadIcon height={24} />,
    label: "Exportar",
    variant: "contained" as const,
    onClick: () => console.log("exportar"),
  },
];

export function ReportsPage() {
  return (
    <Stack gap={2}>
      <PageHeader
        title="Relatórios"
        subtitle="Histórico de consumo e análises do sistema">
        {headerButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            startIcon={button.icon}
            onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
      </PageHeader>
    </Stack>
  );
}
