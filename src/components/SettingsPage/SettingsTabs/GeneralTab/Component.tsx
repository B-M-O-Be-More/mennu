import { Box, Button, CardMedia, CircularProgress, Divider, Stack, Switch, Typography } from "@mui/material";
import { GeneralTabProps } from "./interface";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/FormControl/Input";
import { GeneralSettingsFormData, generalSettingsSchema } from "@/schemas/generalSettingsSchema";
import { ImageIcon, UploadIcon } from "@/components/Icons";
import { theme } from "@/theme/theme";
import React from "react";
import UploadImageModal from "@/components/Modals/UploadImageModal";
import { fileToFileList, urlToFile } from "@/utils/fileUtils";
import Toast from "@/components/Toast";
import { AlertColor } from "@mui/material";
import useFetch from "@/hooks/useFetch/hook";

export default function GeneralTab({ }: GeneralTabProps) {
  const [openUploadLogoModal, setOpenUploadLogoModal] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: AlertColor; }>({
    open: false, message: "", severity: "info",
  });

  const [requestGet, isLoadingGet] = useFetch<Record<string, unknown>>();
  const [requestPut, isLoadingPut] = useFetch<Record<string, unknown>>();

  const { register, handleSubmit, formState: { errors }, control, watch, reset, setValue } =
    useForm<GeneralSettingsFormData>({
      resolver: yupResolver(generalSettingsSchema),
      defaultValues: { systemName: "", description: "", emailNotifications: false, maintenanceMode: false, image: null },
    });

  const imageFile = watch("image")?.[0] ?? null;
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!imageFile) { setPreviewUrl(null); return; }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  React.useEffect(() => {
    let isMounted = true;

    requestGet("/api/configuracoes/geral/", { method: "GET" })
      .then(async (resp) => {
        if (!isMounted) return;
        const data = resp as unknown as Record<string, unknown>;
        const logoUrl = data.logo_url as string | null;

        let fileList: FileList | null = null;
        if (logoUrl) {
          const file = await urlToFile(logoUrl, "logo.png");
          if (file) fileList = fileToFileList(file);
        }

        reset({
          systemName: (data.nome_sistema as string) ?? "",
          description: (data.descricao as string) ?? "",
          emailNotifications: (data.notificacoes_email as boolean) ?? false,
          maintenanceMode: (data.modo_manutencao as boolean) ?? false,
          image: fileList,
        });

        if (logoUrl) setPreviewUrl(logoUrl);
      })
      .catch(() => {
        if (!isMounted) return;
        setToast({ open: true, message: "Erro ao carregar configurações gerais.", severity: "error" });
      });

    return () => { isMounted = false; };
  }, []);

  const onSubmit = async (data: GeneralSettingsFormData) => {
    try {
      await requestPut("/api/configuracoes/geral/", {
        method: "PUT",
        body: {
          nome_sistema: data.systemName,
          descricao: data.description,
          notificacoes_email: data.emailNotifications,
          modo_manutencao: data.maintenanceMode,
        },
      });
      setToast({ open: true, message: "Configurações salvas com sucesso!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Erro ao salvar configurações.", severity: "error" });
    }
  };

  const handleLogoSave = async (file: File) => {
    setValue("image", fileToFileList(file));
    const formData = new FormData();
    formData.append("arquivo", file);

    try {
      const response = await fetch("/api/configuracoes/geral/logo/", { method: "POST", body: formData });
      if (!response.ok) throw new Error();
      setToast({ open: true, message: "Logo atualizado com sucesso!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Erro ao fazer upload do logo.", severity: "error" });
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight={400}>Configurações Gerais</Typography>
      {isLoadingGet ? (
        <Stack alignItems="center" py={4}><CircularProgress /></Stack>
      ) : (
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2} px={1}>
            <Box>
              <Typography fontWeight={400} mb={1}>Logo do Sistema</Typography>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                {previewUrl ? (
                  <CardMedia
                    component="img"
                    image={previewUrl}
                    alt="Logo do Sistema"
                    sx={{ height: 100, width: "auto", borderRadius: 3, bgcolor: "grey.50", objectFit: "contain" }}
                  />
                ) : (
                  <Box bgcolor={"grey.50"} border={"2px solid"} borderColor={"grey.300"} borderRadius={3} padding={3.6}>
                    <ImageIcon color={theme.palette.grey[400]} width={36} height={36} />
                  </Box>
                )}
                <Box width={"100%"}>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon color={theme.palette.primary.main} height={20} width={20} />}
                    sx={{ borderRadius: 3, color: theme.palette.primary.main, textTransform: "none", py: 1, width: { xs: "100%", sm: "60%", md: "30%" }, justifyContent: "flex-start" }}
                    onClick={() => setOpenUploadLogoModal(true)}
                  >
                    Fazer Upload
                  </Button>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Formatos aceitos: JPG, PNG, SVG (máx. 2MB)
                  </Typography>
                </Box>
              </Stack>

              <UploadImageModal
                open={openUploadLogoModal}
                onClose={() => setOpenUploadLogoModal(false)}
                title="Upload de Logo"
                image={imageFile}
                onSave={handleLogoSave}
              />
            </Box>

            <Input
              label="Nome do Sistema"
              placeholder="Mennu"
              optional={false}
              register={register("systemName")}
              error={errors.systemName?.message}
            />

            <Input
              label="Descrição"
              placeholder="Sistema de Gestão Inteligente de Refeições"
              optional={false}
              register={register("description")}
              error={errors.description?.message}
              multiline
            />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={400}>Notificações por E-mail</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={400}>
                  Receba notificações importantes por e-mail
                </Typography>
              </Box>
              <Controller
                name="emailNotifications"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>

            <Divider sx={{ my: 1, borderColor: "grey.100" }} />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Typography fontWeight={400}>Modo Manutenção</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={400}>
                  Ativar modo de manutenção do sistema
                </Typography>
              </Box>
              <Controller
                name="maintenanceMode"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </Stack>
          </Stack>
          <Button
            variant="contained"
            sx={{ borderRadius: 3, mt: 2 }}
            type="submit"
            disabled={isLoadingPut}
          >
            {isLoadingPut ? <CircularProgress size={20} color="inherit" /> : "Salvar Alterações"}
          </Button>
        </Box>
      )}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </>
  );
}
