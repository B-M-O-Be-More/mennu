"use client";

import React from "react";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Card from "@/components/Cards/Card";
import { BuildingIcon, CircledCheckIcon } from "@/components/Icons";
import { useUser } from "@/context/AuthContext";
import { IUserContext } from "@/Interfaces/User/context";
import { SelectUnitPageProps, UnitOptionProps } from "./interface";

/**
 * Passo entre o login e o app: o usuário pode ter vínculo em várias unidades
 * da mesma empresa, e cada uma tem cargo e permissões próprios. A escolha
 * define o header `unidade-id-x` de todas as requisições seguintes.
 */

function UnitOption({ contexto, selected, onSelect }: UnitOptionProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={() => onSelect(contexto)}
      aria-pressed={selected}
      sx={{
        width: "100%",
        textAlign: "left",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected ? "sidebar.bgActive" : "background.paper",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 1.75 },
        transition: "0.2s all",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: selected ? "sidebar.bgActiveHover" : "sidebar.bgHover",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2,
            bgcolor: selected ? "primary.main" : "action.hover",
          }}
        >
          <BuildingIcon
            width={20}
            height={20}
            color={
              selected
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary
            }
          />
        </Box>

        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            noWrap
            title={contexto.unidade_nome}
            sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {contexto.unidade_nome}
          </Typography>
          <Typography
            noWrap
            title={contexto.empresa_nome}
            variant="body2"
            color="text.secondary"
          >
            {contexto.empresa_nome}
          </Typography>

          {contexto.cargos.length > 0 || contexto.acesso_total ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap pt={0.5}>
              {contexto.cargos.map((cargo) => (
                <Chip
                  key={cargo.id}
                  label={cargo.nome}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 11, height: 22 }}
                />
              ))}
              {contexto.acesso_total ? (
                <Chip
                  label="Acesso total"
                  size="small"
                  color="primary"
                  sx={{ fontSize: 11, height: 22 }}
                />
              ) : null}
            </Stack>
          ) : null}
        </Stack>

        {selected ? (
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <CircledCheckIcon
              width={22}
              height={22}
              color={theme.palette.primary.main}
            />
          </Box>
        ) : null}
      </Stack>
    </ButtonBase>
  );
}

export function SelectUnitPage({}: SelectUnitPageProps) {
  const {
    user,
    contexts,
    activeContext,
    isLoadingPages,
    isLoadingContext,
    selectContext,
    logout,
  } = useUser();

  // Uma única unidade já vem marcada — a confirmação continua explícita,
  // mas sem obrigar o clique na única opção possível.
  const [selectedUnidadeId, setSelectedUnidadeId] = React.useState<number | null>(
    () => activeContext?.unidade_id ?? null,
  );

  React.useEffect(() => {
    if (selectedUnidadeId !== null) return;
    if (activeContext) {
      setSelectedUnidadeId(activeContext.unidade_id);
      return;
    }
    if (contexts.length === 1) setSelectedUnidadeId(contexts[0].unidade_id);
  }, [activeContext, contexts, selectedUnidadeId]);

  const selected = React.useMemo(
    () =>
      contexts.find((contexto) => contexto.unidade_id === selectedUnidadeId) ??
      null,
    [contexts, selectedUnidadeId],
  );

  const handleSelect = React.useCallback((contexto: IUserContext) => {
    setSelectedUnidadeId(contexto.unidade_id);
  }, []);

  const handleConfirm = () => {
    if (!selected) return;
    selectContext(selected);
  };

  const hasContexts = contexts.length > 0;

  return (
    <Box bgcolor="primary.main" height="100%" position="relative">
      <Card
        alignItems="center"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        width="540px"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "calc(100% - 2rem)",
          maxHeight: "calc(100dvh - 2rem)",
        }}
      >
        <Stack
          bgcolor="primary.main"
          borderRadius={3}
          alignItems="center"
          paddingX={4}
          paddingY={2}
        >
          <Typography variant="h4" color="primary.contrastText" fontWeight={400}>
            Mennu
          </Typography>
        </Stack>

        <Stack alignItems="center" gap={1} width="100%">
          <Typography variant="h5" fontWeight={600} textAlign="center">
            Selecione a unidade
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={400}
            textAlign="center"
          >
            {user?.nome
              ? `${user.nome}, escolha onde deseja trabalhar nesta sessão`
              : "Escolha onde deseja trabalhar nesta sessão"}
          </Typography>
        </Stack>

        {isLoadingPages ? (
          <Stack alignItems="center" py={4} width="100%">
            <CircularProgress size={28} />
          </Stack>
        ) : hasContexts ? (
          <Stack
            spacing={1}
            width="100%"
            sx={{
              maxHeight: 320,
              overflowY: "auto",
              overscrollBehavior: "contain",
              px: 0.25,
              py: 0.25,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: 3,
                backgroundColor: "divider",
              },
              scrollbarWidth: "thin",
            }}
          >
            {contexts.map((contexto) => (
              <UnitOption
                key={`${contexto.empresa_id}-${contexto.unidade_id}`}
                contexto={contexto}
                selected={contexto.unidade_id === selectedUnidadeId}
                onSelect={handleSelect}
              />
            ))}
          </Stack>
        ) : (
          <Stack alignItems="center" gap={1} py={3} width="100%">
            <Typography variant="subtitle1" fontWeight={600} textAlign="center">
              Nenhuma unidade disponível
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Seu usuário não está vinculado a nenhuma unidade. Fale com a
              administração para liberar o acesso.
            </Typography>
          </Stack>
        )}

        {hasContexts ? (
          <Button
            sx={{ width: "100%", height: "3.5rem", fontWeight: 400 }}
            variant="contained"
            onClick={handleConfirm}
            disabled={!selected}
            loading={isLoadingContext}
          >
            Entrar
          </Button>
        ) : null}

        <Button variant="text" color="inherit" onClick={logout} sx={{ fontWeight: 400 }}>
          Sair da conta
        </Button>
      </Card>
    </Box>
  );
}
