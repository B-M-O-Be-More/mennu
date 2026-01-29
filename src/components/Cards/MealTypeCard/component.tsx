"use client";

import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import { ClockIcon, EditIcon } from "@/components/Icons";
import { RefeicoesIcon } from "@/components/Sidebar/icons";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MealTypeCardProps } from "./interface";
import React from "react";
import EditMealTypeModal from "@/components/Modals/EditMealTypeModal";

export function MealTypeCard({ type }: MealTypeCardProps) {
  const {
    id,
    typeName,
    description,
    startTime,
    endTime,
    status,
    units,
    validations,
  } = type;

  const [openEditTypeModal, setOpenEditTypeModal] = React.useState(false);
  const theme = useTheme();

  return (
    <Card
      variant="compact"
      sx={{ padding: "1rem", maxWidth: { md: "49%" }, minWidth: "49%" }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack gap={2} direction={"row"}>
          <IconBox
            icon={<RefeicoesIcon color={theme.palette.primary.main} />}
            bgColor="sidebar.bgActive"
          />
          <Box component="span" alignContent={"center"}>
            <Stack direction={"row"} gap={1}>
              <Typography>{typeName}</Typography>
              <Chip
                color={status === "ativo" ? "success" : "default"}
                label={status}
                size="small"
                sx={{ minWidth: "fit-content" }}
              />
            </Stack>
            <Typography
              variant="subtitle1"
              fontWeight={400}
              color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          aria-label="edit"
          size="small"
          onClick={() => setOpenEditTypeModal(true)}
          sx={{
            marginRight: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            height: "2.25rem",
            color: "default.dark",
          }}>
          <EditIcon height={20} />
        </IconButton>
        <EditMealTypeModal
          open={openEditTypeModal}
          onClose={() => setOpenEditTypeModal(false)}
          typeId={id}
          initialData={type}
        />
      </Stack>

      <Stack gap={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Horário:
          </Typography>

          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Stack sx={{ color: "default.dark" }}>
              <ClockIcon />
            </Stack>

            <Typography>
              {startTime} – {endTime}
            </Typography>
          </Stack>
        </Box>

        <Stack direction={"row"}>
          <Stack width={"50%"}>
            <Typography variant="body2" color="text.secondary">
              Validações:
            </Typography>
            <Stack direction={"row"} gap={"5px"} flexWrap={"wrap"}>
              {validations?.map((validation) => (
                <Chip
                  key={validation.id}
                  label={validation.shortLabel}
                  icon={validation.icon}
                  size="small"
                  color={validation.chipColor}
                  sx={{ width: "fit-content" }}
                />
              ))}
            </Stack>
          </Stack>

          <Stack>
            <Typography variant="body2" color="text.secondary">
              Unidades:
            </Typography>

            <Stack direction={"row"} flexWrap={"wrap"} gap={"5px"}>
              {units?.map((unit) => (
                <Chip
                  key={unit.id}
                  label={unit.label}
                  size="small"
                  color={"info"}
                  sx={{ width: "fit-content" }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
