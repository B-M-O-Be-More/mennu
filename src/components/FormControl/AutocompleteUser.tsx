import * as React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { Controller } from "react-hook-form";

interface UserOption {
  label: string;
  value: string;
}

interface AutocompleteUserProps {
  name: string;
  control: any;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export function AutocompleteUser({ name, control, error, label, disabled }: AutocompleteUserProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<UserOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const fetchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = React.useCallback(async (search: string) => {
    setLoading(true);
    try {
      const url = search.trim()
        ? `/api/usuarios?busca=${encodeURIComponent(search)}`
        : "/api/usuarios";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const data = await res.json();
      const users = Array.isArray(data.results) ? data.results : Array.isArray(data.data?.results) ? data.data.results : Array.isArray(data.data) ? data.data : [];
      setOptions(
        users.map((u: any) => ({
          label: u.matricula ? `${u.nome ?? `Usuário ${u.id}`} (${u.matricula})` : (u.nome ?? `Usuário ${u.id}`),
          value: String(u.id),
        }))
      );
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(() => {
      fetchUsers(inputValue);
    }, 400);
    return () => {
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    };
  }, [inputValue, fetchUsers]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          disabled={disabled}
          options={options}
          loading={loading}
          value={options.find((o) => o.value === field.value) || null}
          onChange={(_, newValue) => field.onChange(newValue ? newValue.value : "")}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText={inputValue.trim().length === 0 ? "Digite para buscar usuários" : "Nenhum usuário encontrado"}
        />
      )}
    />
  );
}
