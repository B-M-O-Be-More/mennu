"use client";

import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import Card from "@/components/Cards/Card";
import { FilterIcon, TwistedArrowIcon } from "@/components/Icons";
import { ReportFilterBarProps } from "./interface";

/**
 * Barra de filtros comum a todos os relatórios.
 *
 * Semântica: é um `<form>` rotulado, dividido em `<fieldset>` com legenda
 * ("Período", "Escopo", "Refinamento"), e o que está valendo aparece como
 * chip — o usuário lê o recorte sem abrir os campos.
 *
 * Recuperação: nada é aplicado sem o submit, "Descartar" volta o rascunho,
 * "Desfazer" volta o recorte anterior, cada chip remove um filtro só e
 * período invertido vira um aviso com o conserto de um clique.
 */
export function ReportFilterBar({
  groups,
  chips = [],
  dirty,
  canClear,
  canUndo = false,
  dateIssue = null,
  isLoading = false,
  onApply,
  onDiscard,
  onClear,
  onUndo,
}: ReportFilterBarProps) {
  return (
    <Card
      component="form"
      aria-label="Filtros do relatório"
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        if (!dateIssue) onApply();
      }}
      sx={{ p: { xs: 1.5, md: 2 } }}
    >
      <Stack gap={1.5}>
        <Stack direction="row" gap={1} alignItems="center">
          <FilterIcon height={18} width={18} />
          <Typography variant="body2" component="h2" fontWeight={600}>
            Filtros
          </Typography>
          {dirty && (
            <Typography variant="caption" color="warning.contrastText">
              alterações não aplicadas
            </Typography>
          )}
        </Stack>

        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{ xs: "1fr", md: `repeat(${Math.min(groups.length, 3)}, auto)` }}
          alignItems="flex-end"
        >
          {groups.map((group) => (
            <Box key={group.id} component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
              <Typography
                component="legend"
                variant="caption"
                color="text.secondary"
                sx={{ p: 0, mb: 0.75, textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                {group.titulo}
              </Typography>
              {group.extra && <Box mb={1}>{group.extra}</Box>}
              <Box display="grid" gap={1} gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))">
                {group.children}
              </Box>
            </Box>
          ))}
        </Box>

        {dateIssue && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={dateIssue.onFix}>
                {dateIssue.actionLabel}
              </Button>
            }
          >
            {dateIssue.message}
          </Alert>
        )}

        {chips.length > 0 && (
          <Stack direction="row" gap={1} flexWrap="wrap" aria-label="Filtros aplicados" component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {chips.map((chip) => (
              <li key={chip.key}>
                <Chip
                  label={chip.label}
                  size="small"
                  color="warning"
                  variant="outlined"
                  onDelete={chip.onRemove}
                />
              </li>
            ))}
          </Stack>
        )}

        <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="flex-end">
          {canUndo && onUndo && (
            <Button
              size="small"
              variant="text"
              startIcon={<TwistedArrowIcon height={16} width={16} />}
              onClick={onUndo}
            >
              Desfazer
            </Button>
          )}
          {dirty && (
            <Button size="small" variant="text" onClick={onDiscard}>
              Descartar alterações
            </Button>
          )}
          <Button size="small" variant="outlined" onClick={onClear} disabled={!canClear && !dirty}>
            Limpar tudo
          </Button>
          <Button
            type="submit"
            size="small"
            variant={dirty ? "contained" : "outlined"}
            disabled={!dirty || Boolean(dateIssue) || isLoading}
          >
            {dirty ? "Aplicar filtros" : "Filtros aplicados"}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
