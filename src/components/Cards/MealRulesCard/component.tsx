import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import { Box, Button, Stack, Typography } from "@mui/material";
import { MealRulesCardProps } from "./interface";
import { useTheme } from "@mui/material/styles";
import { ErrorOutline } from "@mui/icons-material";
import MealRuleItem from "../../MealsPage/MealRuleItem";
import React from "react";
import EditMealRulesModal from "@/components/Modals/EditMealRulesModal";
import { ConfiguracoesIcon } from "@/components/Icons";

export function MealRulesCard({ rule }: MealRulesCardProps) {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const theme = useTheme();

  return (
    <Card
      variant="compact"
      sx={{ padding: "1rem", maxWidth: { md: "49%" }, minWidth: "49%" }}>
      <Stack gap={3}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Stack direction={"row"} gap={2}>
            <IconBox
              icon={<ConfiguracoesIcon color={theme.palette.info.light} />}
              bgColor="info.main"
            />
            <Box component="span" alignContent={"center"}>
              <Typography>{rule.unit}</Typography>
              <Typography
                variant="subtitle1"
                fontWeight={400}
                color="text.secondary">
                Configurações de limite e controle
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenEditModal(true)}
            sx={{ padding: "0.75rem", color: "info.light" }}>
            Editar Regras
          </Button>

          <EditMealRulesModal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            initialData={rule}
            id={rule.id}
          />
        </Stack>

        <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
          <MealRuleItem
            label="Limite Diário"
            description={"refeições/dia"}
            value={rule.dailyLimit}
          />
          <MealRuleItem
            label="Limite Semanal"
            description={"refeições/semana"}
            value={rule.weeklyLimit}
          />
          <MealRuleItem
            label="Limite Mensal"
            description={"refeições/mês"}
            value={rule.monthlyLimit}
          />
          <MealRuleItem
            label="Intervalo Mínimo"
            description={"minutos"}
            value={rule.minInterval}
          />
        </Stack>

        {rule.isTimeRestricted ? (
          <Stack
            direction="row"
            border={"none"}
            borderRadius={3}
            padding={1}
            gap={2}
            width={"fit-content"}
            bgcolor={"error.main"}>
            <ErrorOutline sx={{ color: "error.contrastText" }} />
            <Box>
              <Typography variant="body2" color="error.contrastText">
                Bloqueio fora de horário ativado
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack
            direction="row"
            border={"none"}
            borderRadius={3}
            padding={1}
            gap={2}
            width={"fit-content"}
            bgcolor={"success.main"}>
            <ErrorOutline sx={{ color: "success.contrastText" }} />
            <Box>
              <Typography variant="body2" color="success.contrastText">
                Permite acesso fora de horário
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
