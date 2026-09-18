"use client";

import { Alert, Box, Button, CardMedia, Divider, Stack, Switch, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import Input from "@/components/FormControl/Input";
import UploadImageModal from "@/components/Modals/UploadImageModal";
import { ImageIcon, UploadIcon } from "@/components/Icons";
import { GeneralTabProps } from "./interface";
import { GeneralSettingsFormData, generalSettingsSchema } from "@/schemas/generalSettingsSchema";
import { GeneralSettingsApi } from "@/Interfaces/Settings/settings";
import { resolveLogoUrl, settingsService } from "@/services/settingsService";
import { theme } from "@/theme/theme";
import Can from "@/components/Can";

function toFormValues(settings: GeneralSettingsApi): GeneralSettingsFormData {
  return { systemName: settings.nome_sistema, description: settings.descricao ?? "", emailNotifications: settings.notificacoes_email, maintenanceMode: settings.modo_manutencao, image: null };
}

export default function GeneralTab({}: GeneralTabProps) {
  const [openUploadLogoModal, setOpenUploadLogoModal] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm<GeneralSettingsFormData>({
    resolver: yupResolver(generalSettingsSchema),
    defaultValues: { systemName: "", description: "", emailNotifications: false, maintenanceMode: false, image: null },
  });
  const imageFile = watch("image")?.[0] ?? null;
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!imageFile) { setLocalPreview(null); return; }
    const objectUrl = URL.createObjectURL(imageFile);
    setLocalPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  React.useEffect(() => {
    let active = true;
    settingsService.getGeneral()
      .then((settings) => { if (active) { reset(toFormValues(settings)); setLogoUrl(resolveLogoUrl(settings.logo_url)); } })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : "Erro ao carregar configurações"); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [reset]);

  const onSubmit = async (data: GeneralSettingsFormData) => {
    setError(null); setIsSaving(true);
    try {
      const updated = await settingsService.updateGeneral({ nome_sistema: data.systemName, descricao: data.description, notificacoes_email: data.emailNotifications, modo_manutencao: data.maintenanceMode });
      reset(toFormValues(updated)); setLogoUrl(resolveLogoUrl(updated.logo_url));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro ao salvar configurações");
    } finally { setIsSaving(false); }
  };

  const handleLogoUpload = async (file: File) => {
    const updated = await settingsService.uploadLogo(file);
    setLogoUrl(resolveLogoUrl(updated.logo_url));
  };

  const previewUrl = localPreview ?? logoUrl;
  const disabled = isLoading || isSaving;

  return (
    <>
      <Typography variant="h6" fontWeight={400}>Configurações Gerais</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} px={1} mt={2}>
          <Box>
            <Typography fontWeight={400} mb={1}>Logo do Sistema</Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              {previewUrl ? <CardMedia component="img" image={previewUrl} alt="Logo do Sistema" sx={{ height: 100, width: "auto", borderRadius: 3, bgcolor: "grey.50", objectFit: "contain" }} /> : <Box bgcolor="grey.50" border="2px solid" borderColor="grey.300" borderRadius={3} padding={3.6}><ImageIcon color={theme.palette.grey[400]} width={36} height={36} /></Box>}
              <Box width="100%"><Button variant="outlined" startIcon={<UploadIcon color={theme.palette.primary.main} height={20} width={20} />} sx={{ borderRadius: 3, color: theme.palette.primary.main, textTransform: "none", py: 1, width: { xs: "100%", sm: "60%", md: "30%" }, justifyContent: "flex-start" }} onClick={() => setOpenUploadLogoModal(true)} disabled={disabled}>Fazer Upload</Button><Typography variant="body2" color="text.secondary" mt={1}>Formatos aceitos: JPG, PNG, SVG (máx. 2MB)</Typography></Box>
            </Stack>
            <UploadImageModal open={openUploadLogoModal} onClose={() => setOpenUploadLogoModal(false)} title="Upload de Logo" image={imageFile} onSave={handleLogoUpload} />
          </Box>
          <Input label="Nome do Sistema" placeholder="Mennu" optional={false} register={register("systemName")} error={errors.systemName?.message} disabled={disabled} />
          <Input label="Descrição" placeholder="Sistema de Gestão Inteligente de Refeições" optional={false} register={register("description")} error={errors.description?.message} multiline disabled={disabled} />
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Notificações por E-mail</Typography><Typography variant="body2" color="text.secondary">Receba notificações importantes por e-mail</Typography></Box><Controller name="emailNotifications" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
          <Divider sx={{ my: 1, borderColor: "grey.100" }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={400}>Modo Manutenção</Typography><Typography variant="body2" color="text.secondary">Ativar modo de manutenção do sistema</Typography></Box><Controller name="maintenanceMode" control={control} render={({ field }) => <Switch {...field} checked={field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />} /></Stack>
        </Stack>
        <Can permissions="configuracao.edit.geral" message="Você não tem permissão para editar as configurações gerais.">
          <Button variant="contained" sx={{ borderRadius: 3, mt: 2 }} type="submit" disabled={disabled}>{isSaving ? "Salvando..." : "Salvar Alterações"}</Button>
        </Can>
      </Box>
    </>
  );
}
