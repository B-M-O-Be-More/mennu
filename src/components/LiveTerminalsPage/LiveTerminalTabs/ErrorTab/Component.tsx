import { Stack, Typography, useTheme } from "@mui/material";
import { ErrorTabProps } from "./";
import IconBox from "@/components/Cards/IconBox/Component";
import { CircledXIcon } from "@/components/Icons";
import React from "react";

export default function ErrorTab({ setTab, accessResult }: ErrorTabProps) {
  const theme = useTheme();

  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    if (count === 0) {
      setTimeout(() => {
        setTab(0);
        return;
      }, 1000);
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, setTab]);

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Stack
        alignItems="center"
        gap={2.6}
        bgcolor="background.paper"
        width={{ xs: "90%", sm: "70%", md: "52%", lg: "40%" }}
        borderRadius={6}
        px={{ xs: 2, md: 5 }}
        py={{ xs: 3, md: 5 }}
        border={"1px solid"}
        borderColor="error.contrastText"
      >
        <IconBox
          icon={<CircledXIcon height={60} width={60} color={theme.palette.error.contrastText} />}
          bgColor="error.main"
          borderRadius="100%"
          padding={5}
        />
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Acesso Negado
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {accessResult?.message ?? "Cartão não autorizado. Entre em contato com o RH."}
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign={"center"}>
          Retornando em {count} segundos...
        </Typography>
      </Stack>
    </Stack >
  );
}