"use client";

import {
  Alert,
  Box,
  Button,
  CardMedia,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Input from "@/components/FormControl/Input";
import ActionModal from "@/components/Modals/ActionModal";
import UploadImageModal from "@/components/Modals/UploadImageModal";
import { ImageIcon, TrashIcon, UploadIcon } from "@/components/Icons";
import { GeneralTabProps } from "./interface";
import {
  GeneralSettingsFormData,
  generalSettingsSchema,
} from "@/schemas/generalSettingsSchema";
import { GeneralSettingsApi } from "@/Interfaces/Settings/settings";
import {
  DEFAULT_SYSTEM_LOGO_SRC,
  GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
  GeneralSettingsLogoUpdatedDetail,
  getGeneralSettingsLogoSrc,
  settingsService,
} from "@/services/settingsService";
import { theme } from "@/theme/theme";
import Can from "@/components/Can";
import { usePushNotifications } from "@/hooks/usePushNotifications/hook";
import { useToast } from "@/hooks/useToast/hook";
import Toast from "@/components/Toast";

function toFormValues(settings: GeneralSettingsApi): GeneralSettingsFormData {
  return {
    systemName: settings.nome_sistema,
    description: settings.descricao ?? "",
    emailNotifications: settings.notificacoes_email,
    maintenanceMode: settings.modo_manutencao,
    image: null,
  };
}

export default function GeneralTab({}: GeneralTabProps) {
  const [openUploadLogoModal, setOpenUploadLogoModal] = React.useState(false);
  const [openDeleteLogoModal, setOpenDeleteLogoModal] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [hasCustomLogo, setHasCustomLogo] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<GeneralSettingsFormData>({
    resolver: yupResolver(generalSettingsSchema),
    defaultValues: {
      systemName: "",
      description: "",
      emailNotifications: false,
      maintenanceMode: false,
      image: null,
    },
  });
  React.useEffect(() => {
    let active = true;
    settingsService
      .getGeneral()
      .then((settings) => {
        if (active) {
          reset(toFormValues(settings));
          setLogoUrl(getGeneralSettingsLogoSrc(settings));
          setHasCustomLogo(Boolean(settings.logo_url));
        }
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Erro ao carregar configurações",
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reset]);

  const onSubmit = async (data: GeneralSettingsFormData) => {
    setError(null);
    setIsSaving(true);
    try {
      const updated = await settingsService.updateGeneral({
        nome_sistema: data.systemName,
        descricao: data.description,
        notificacoes_email: data.emailNotifications,
        modo_manutencao: data.maintenanceMode,
      });
      reset(toFormValues(updated));
      setLogoUrl(getGeneralSettingsLogoSrc(updated));
      setHasCustomLogo(Boolean(updated.logo_url));
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Erro ao salvar configurações",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    const updated = await settingsService.uploadLogo(file);
    const updatedLogoSrc = getGeneralSettingsLogoSrc(updated);
    setLogoUrl(updatedLogoSrc);
    setHasCustomLogo(Boolean(updated.logo_url));
    window.dispatchEvent(
      new CustomEvent<GeneralSettingsLogoUpdatedDetail>(
        GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
        {
          detail: { logoSrc: updatedLogoSrc },
        },
      ),
    );
  };

  const previewUrl = logoUrl;
  const disabled = isLoading || isSaving || isDeletingLogo;

  const { permission, isRegistering, requestPermission } =
    usePushNotifications();
  const { toast, showToast, closeToast } = useToast();

  const handleDeleteLogo = async () => {
    setIsDeletingLogo(true);
    setError(null);

    try {
      await settingsService.deleteLogo();
      setLogoUrl(DEFAULT_SYSTEM_LOGO_SRC);
      setHasCustomLogo(false);
      setOpenDeleteLogoModal(false);
      window.dispatchEvent(
        new CustomEvent<GeneralSettingsLogoUpdatedDetail>(
          GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
          { detail: { logoSrc: DEFAULT_SYSTEM_LOGO_SRC } },
        ),
      );
      showToast("Logo removido com sucesso", "success");
    } catch (deleteError) {
      showToast(
        deleteError instanceof Error
          ? deleteError.message
          : "Não foi possível remover o logo",
        "error",
      );
    } finally {
      setIsDeletingLogo(false);
    }
  };

  const browserPushLabel =
    permission === "loading"
      ? "Verificando suporte a notificações..."
      : permission === "denied"
      ? "Bloqueadas nas configurações do navegador."
      : permission === "unsupported"
        ? "Este navegador não suporta notificações."
        : permission === "granted"
          ? "Ativadas — você recebe avisos mesmo com o navegador fechado."
          : "Ative para receber avisos mesmo com o navegador fechado.";

  // `Notification.requestPermission()` com permissão já concedida resolve
  // "granted" sem reabrir prompt — então isso também serve pra reenviar o
  // token quando a permissão foi concedida mas o registro no Novu falhou.
  async function handleTogglePush() {
    if (permission === "denied" || permission === "unsupported") return;
    const result = await requestPermission();
    if (result.success) {
      showToast("Notificações do navegador ativadas", "success");
    } else {
      showToast(
        result.message ?? "Não foi possível ativar as notificações",
        "error",
      );
    }
  }

  return (
    <>
      <Typography variant="h6" fontWeight={400}>
        Configurações Gerais
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} px={1} mt={2}>
          <Box>
            <Typography fontWeight={400} mb={1}>
              Logo do Sistema
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
            >
              {previewUrl ? (
                <CardMedia
                  component="img"
                  image={previewUrl}
                  alt="Logo do Sistema"
                  onError={() => setLogoUrl(DEFAULT_SYSTEM_LOGO_SRC)}
                  sx={{
                    width: { xs: "100%", sm: 324 },
                    maxWidth: "100%",
                    aspectRatio: "18 / 5",
                    borderRadius: 3,
                    bgcolor: "background.auth",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  bgcolor="grey.50"
                  border="2px solid"
                  borderColor="grey.300"
                  borderRadius={3}
                  padding={3.6}
                >
                  <ImageIcon
                    color={theme.palette.grey[400]}
                    width={36}
                    height={36}
                  />
                </Box>
              )}
              <Box width="100%">
                <Stack direction={{ xs: "column", md: "row" }} gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={
                      <UploadIcon
                        color={theme.palette.primary.main}
                        height={20}
                        width={20}
                      />
                    }
                    sx={{
                      borderRadius: 3,
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      py: 1,
                      minHeight: 44,
                      justifyContent: "flex-start",
                    }}
                    onClick={() => setOpenUploadLogoModal(true)}
                    disabled={disabled}
                  >
                    Fazer Upload
                  </Button>
                  {hasCustomLogo && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<TrashIcon width={20} height={20} />}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        py: 1,
                        minHeight: 44,
                        justifyContent: "flex-start",
                      }}
                      onClick={() => setOpenDeleteLogoModal(true)}
                      disabled={disabled}
                    >
                      Remover logo
                    </Button>
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  JPG, PNG ou SVG, até 2 MB. O arquivo será recortado em 18:5.
                </Typography>
              </Box>
            </Stack>
            <UploadImageModal
              open={openUploadLogoModal}
              onClose={() => setOpenUploadLogoModal(false)}
              title="Upload de Logo"
              image={null}
              onSave={handleLogoUpload}
            />
          </Box>
          <Input
            label="Nome do Sistema"
            placeholder="Mennu"
            optional={false}
            register={register("systemName")}
            error={errors.systemName?.message}
            disabled={disabled}
          />
          <Input
            label="Descrição"
            placeholder="Sistema de Gestão Inteligente de Refeições"
            optional={false}
            register={register("description")}
            error={errors.description?.message}
            multiline
            disabled={disabled}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={400}>Notificações por E-mail</Typography>
              <Typography variant="body2" color="text.secondary">
                Receba notificações importantes por e-mail
              </Typography>
            </Box>
            <Controller
              name="emailNotifications"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  disabled={disabled}
                />
              )}
            />
          </Stack>
          <Divider sx={{ my: 1, borderColor: "grey.100" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={400}>
                Notificações do Navegador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {browserPushLabel}
              </Typography>
            </Box>
            <Switch
              checked={permission === "granted"}
              disabled={
                isRegistering ||
                permission === "loading" ||
                permission === "denied" ||
                permission === "unsupported"
              }
              onChange={handleTogglePush}
            />
          </Stack>
          <Divider sx={{ my: 1, borderColor: "grey.100" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={400}>Modo Manutenção</Typography>
              <Typography variant="body2" color="text.secondary">
                Ativar modo de manutenção do sistema
              </Typography>
            </Box>
            <Controller
              name="maintenanceMode"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  disabled={disabled}
                />
              )}
            />
          </Stack>
        </Stack>
        <Can
          permissions="configuracao.edit.geral"
          message="Você não tem permissão para editar as configurações gerais."
        >
          <Button
            variant="contained"
            sx={{ borderRadius: 3, mt: 2 }}
            type="submit"
            disabled={disabled}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Can>
      </Box>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
      <ActionModal
        open={openDeleteLogoModal}
        loading={isDeletingLogo}
        onCancel={() => setOpenDeleteLogoModal(false)}
        onConfirm={() => void handleDeleteLogo()}
        title="Remover logo personalizado?"
        subtitle="A sidebar voltará a usar o logo padrão da Mennu."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        color="error"
        icon={<TrashIcon width={60} height={60} />}
      />
    </>
  );
}
