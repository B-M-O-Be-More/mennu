import { Box, Button, CardMedia, Divider, Stack, Switch, Typography } from "@mui/material";
import { GeneralTabProps } from "./interface";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/FormControl/Input";
import { GeneralSettingsFormData, generalSettingsSchema } from "@/schemas/generalSettingsSchema";
import { IGeneralSettings } from "@/Interfaces/GeneralSettings/generalSettings";
import { DownloadIcon, ImageIcon } from "@/components/Icons";
import { theme } from "@/theme/theme";
import React from "react";
import UploadImageModal from "@/components/Modals/UploadImageModal";
import { fileToFileList, urlToFile } from "@/utils/fileUtil";

const generalSettingsMock: IGeneralSettings = {
  //logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  logo: null,
  systemName: "Mennu",
  description: "Sistema de Gestão Inteligente de Refeições",
  emailNotifications: true,
  maintenanceMode: true,
};

export default function GeneralTab({ }: GeneralTabProps) {
  const [openUploadLogoModal, setOpenUploadLogoModal] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, control, watch, reset, setValue } =
    useForm<GeneralSettingsFormData>({
      resolver: yupResolver(generalSettingsSchema),
      defaultValues: {
        ...generalSettingsMock,
        image: null,
      },
    });

  const imageFile = watch("image")?.[0] ?? null;


  React.useEffect(() => {
    const initializeForm = async () => {
      if (!generalSettingsMock.logo) return;

      const file = await urlToFile(generalSettingsMock.logo, "logo.png");
      const fileList = fileToFileList(file);
      reset({ ...generalSettingsMock, image: fileList });
    };
    initializeForm();
  }, [reset]);

  const onSubmit = (data: GeneralSettingsFormData) => {
    console.log("Data:", data);
  };

  return (
    <>
      <Typography variant="h6" fontWeight={400}>Configurações Gerais</Typography>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} px={1}>
          <Box>
            <Typography fontWeight={400} mb={1}>Logo do Sistema</Typography>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              {imageFile ? (
                <CardMedia
                  component="img"
                  image={URL.createObjectURL(imageFile)}
                  alt="Logo do Sistema"
                  sx={{
                    height: 100,
                    width: "auto",
                    borderRadius: 3,
                    bgcolor: "grey.50",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  bgcolor={"grey.50"}
                  border={"2px solid"}
                  borderColor={"grey.300"}
                  borderRadius={3}
                  padding={3.6}
                >
                  <ImageIcon color={theme.palette.grey[400]} width={36} height={36} />
                </Box>
              )}

              <Box width={"100%"}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon color={theme.palette.primary.main} height={20} width={20} />}
                  sx={{
                    borderRadius: 3,
                    color: theme.palette.primary.main,
                    textTransform: "none",
                    py: 1,
                    width: { xs: "100%", sm: "60%", md: "30%" },
                    justifyContent: "flex-start",
                  }}
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
              onSave={(file) => setValue("image", fileToFileList(file))}
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
        <Button variant="contained" sx={{ borderRadius: 3, mt: 2 }} type="submit">
          Salvar Alterações
        </Button>
      </Box>
    </>
  );
}
