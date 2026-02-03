import { Divider, Stack, Typography, useTheme } from "@mui/material";
import { MainTabProps } from "./interface";
import IconBox from "@/components/Cards/IconBox/Component";
import { CardIcon, PhoneIcon, QRCodeIcon } from "@/components/Icons";

export default function MainTab({ }: MainTabProps) {
  const theme = useTheme();

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Stack
        alignItems="center"
        gap={2.6}
        bgcolor="background.paper"
        width={{ xs: "90%", sm: "70%", md: "40%", lg: "26%" }}
        borderRadius={3}
        px={2}
        py={{ xs: 6, md: 12 }}
      >
        <IconBox
          icon={<PhoneIcon height={80} width={80} color={theme.palette.info.contrastText} />}
          bgColor="info.main"
          borderRadius="100%"
          padding={5}
        />
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Aproxime seu cartão
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Use NFC, QR Code ou cartão de acesso
        </Typography>

        <Divider sx={{ borderColor: "grey.100", width: "100%", my: 2 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-around"
          width={{ sm: "100%", md: "90%", lg: "80%" }}
          gap={{ xs: 3, sm: 0 }}
        >
          <Stack alignItems="center" gap={2}>
            <IconBox
              icon={<PhoneIcon height={40} width={40} color={theme.palette.purple.contrastText} />}
              bgColor="purple.main"
            />
            <Typography variant="body2" color="text.secondary">NFC</Typography>
          </Stack>
          <Stack alignItems="center" gap={2}>
            <IconBox
              icon={<QRCodeIcon height={40} width={40} color={theme.palette.success.contrastText} />}
              bgColor="success.main"
            />
            <Typography variant="body2" color="text.secondary">QR Code</Typography>
          </Stack>
          <Stack alignItems="center" gap={2}>
            <IconBox
              icon={<CardIcon height={40} width={40} color={theme.palette.warning.contrastText} />}
              bgColor="warning.main"
            />
            <Typography variant="body2" color="text.secondary">Cartão</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}