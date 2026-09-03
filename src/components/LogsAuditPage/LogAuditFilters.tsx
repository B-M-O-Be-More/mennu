import { Stack } from "@mui/material";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { SearchIcon } from "@/components/Icons";
import { ILogAuditFilters } from "@/Interfaces/LogAudit/logAudit";

type Option = { label: string; value: string };

export function LogAuditFilters({
  filters,
  moduleOptions,
  statusOptions,
  onChange,
}: {
  filters: ILogAuditFilters;
  moduleOptions: Option[];
  statusOptions: Option[];
  onChange: (updates: Partial<ILogAuditFilters>) => void;
}) {
  return (
    <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ px: 3, py: 3 }} alignItems={{ xs: "stretch", lg: "center" }}>
      <Input
        placeholder="Buscar por usuário, ação, módulo ou IP..."
        icon={<SearchIcon />}
        value={filters.search}
        onChange={(event) => onChange({ search: event.target.value })}
        sx={{ "& .MuiOutlinedInput-root": { height: 50 } }}
      />
      <Select value={filters.modulo} onChange={(value) => onChange({ modulo: value })} options={moduleOptions} formControlSx={{ width: { xs: "100%", lg: 258 } }} selectSx={{ minHeight: 50 }} />
      <Select value={filters.status} onChange={(value) => onChange({ status: value })} options={statusOptions} formControlSx={{ width: { xs: "100%", lg: 183 } }} selectSx={{ minHeight: 50 }} />
    </Stack>
  );
}
