import { Alert, AlertColor, Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { NewTerminalModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminalSchema, CreateTerminalFormData } from "@/schemas/terminalSchema";
import Card from "@/components/Cards/Card";
import { AlertIcon } from "@/components/Icons";
import React from "react";

const TIPOS_TERMINAL = [
  { label: "Caixa", value: "CAIXA" },
  { label: "Totem", value: "TOTEM" },
  { label: "Entrada", value: "ENTRADA" },
  { label: "Validador", value: "VALIDADOR" },
];

const CATEGORIAS = [
  { label: "Funcionário", value: "funcionario" },
  { label: "Gestor", value: "gestor" },
  { label: "Visitante", value: "visitante" },
  { label: "Terceirizado", value: "terceirizado" },
];

interface Unidade { id: number; nome: string; }
interface TipoRefeicao { id: number; nome: string; }

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const root = payload as Record<string, unknown>;
    if (Array.isArray(root.results)) return root.results as T[];
    if (root.data && typeof root.data === "object") {
      const data = root.data as Record<string, unknown>;
      if (Array.isArray(data.results)) return data.results as T[];
      if (Array.isArray(root.data)) return root.data as T[];
    }
  }
  return [];
}

export default function NewTerminalModal({ open, onClose, onSuccess }: NewTerminalModalProps) {
  const [unidades, setUnidades] = React.useState<Unidade[]>([]);
  const [tiposRefeicao, setTiposRefeicao] = React.useState<TipoRefeicao[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false, message: "", severity: "info",
  });

  const { register, handleSubmit, control, reset, formState: { errors } } =
    useForm<CreateTerminalFormData>({
      resolver: yupResolver(createTerminalSchema),
      defaultValues: {
        nome: "",
        tipo: "",
        unidade_id: undefined,
        refeicoes_permitidas: [],
        categorias_permitidas: [],
        descricao: "",
      },
    });

  React.useEffect(() => {
    if (!open) return;
    reset({ nome: "", tipo: "", unidade_id: undefined, refeicoes_permitidas: [], categorias_permitidas: [], descricao: "" });

    fetch("/api/unidades/")
      .then((r) => r.json())
      .then((resp) => {
        const list = normalizeList<{ id: number; nome: string }>(resp);
        setUnidades(list.map((u) => ({ id: u.id, nome: u.nome })));
      })
      .catch(() => setUnidades([]));

    fetch("/api/tipo-refeicao/")
      .then((r) => r.json())
      .then((resp) => {
        const list = normalizeList<{ id: number; nome: string }>(resp);
        setTiposRefeicao(list.map((r) => ({ id: r.id, nome: r.nome })));
      })
      .catch(() => setTiposRefeicao([]));
  }, [open]);

  const onSubmit = async (data: CreateTerminalFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/terminais/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          tipo: data.tipo,
          unidade_id: Number(data.unidade_id),
          refeicoes_permitidas: (data.refeicoes_permitidas ?? []).map(Number),
          categorias_permitidas: data.categorias_permitidas ?? [],
          descricao: data.descricao ?? "",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? "Erro ao criar terminal");
      }
      setToast({ open: true, message: "Terminal criado com sucesso!", severity: "success" });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setToast({ open: true, message: (err as Error).message ?? "Erro ao criar terminal.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const unidadeOptions = unidades.map((u) => ({ label: u.nome, value: String(u.id) }));

  return (
    <>
      <Modal open={open} onClose={onClose} title="Novo Terminal">
        <Stack gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={2}>
            <Input
              label="Nome do Terminal"
              placeholder="Ex. Terminal Principal"
              optional={false}
              sx={{ flex: 1 }}
              register={register("nome")}
              error={errors.nome?.message}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Select
              label="Unidade"
              options={unidadeOptions}
              control={control}
              name="unidade_id"
              error={errors.unidade_id?.message}
            />

            <Select
              label="Tipo"
              options={TIPOS_TERMINAL}
              control={control}
              name="tipo"
              error={errors.tipo?.message}
            />
          </Stack>

          {tiposRefeicao.length > 0 && (
            <Card>
              <Typography fontWeight={500} mb={1}>Refeições Permitidas</Typography>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                <Controller
                  name="refeicoes_permitidas"
                  control={control}
                  render={({ field }) => (
                    <>
                      {tiposRefeicao.map((ref) => (
                        <label key={ref.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            value={ref.id}
                            checked={(field.value ?? []).map(Number).includes(ref.id)}
                            onChange={(e) => {
                              const current = (field.value ?? []).map(Number);
                              field.onChange(
                                e.target.checked
                                  ? [...current, ref.id]
                                  : current.filter((v) => v !== ref.id)
                              );
                            }}
                          />
                          {ref.nome}
                        </label>
                      ))}
                    </>
                  )}
                />
              </Stack>
            </Card>
          )}

          <Card>
            <Typography fontWeight={500} mb={1}>Categorias Permitidas</Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Controller
                name="categorias_permitidas"
                control={control}
                render={({ field }) => (
                  <>
                    {CATEGORIAS.map((cat) => (
                      <label key={cat.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          value={cat.value}
                          checked={(field.value ?? []).includes(cat.value)}
                          onChange={(e) => {
                            const current = field.value ?? [];
                            field.onChange(
                              e.target.checked
                                ? [...current, cat.value]
                                : current.filter((v) => v !== cat.value)
                            );
                          }}
                        />
                        {cat.label}
                      </label>
                    ))}
                  </>
                )}
              />
            </Stack>
          </Card>

          <Stack direction="row" border="1px solid" borderColor="warning.light" bgcolor="warning.main" borderRadius={2} p={2} gap={1}>
            <AlertIcon color="#E17100" />
            <Box>
              <Typography variant="body1" fontWeight="400" color="warning.contrastText">
                Dependência de Unidade
              </Typography>
              <Typography variant="caption" color="warning.light" fontWeight={400}>
                Os terminais só funcionam se estiverem vinculados a uma unidade ativa. As políticas da unidade serão aplicadas automaticamente ao terminal.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              sx={{ flex: 1, transition: "all 0.2s ease-in-out", "&:hover": { color: "text.primary" } }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Cadastrar Terminal"}
            </Button>
          </Stack>
        </Stack>
      </Modal>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((p) => ({ ...p, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
