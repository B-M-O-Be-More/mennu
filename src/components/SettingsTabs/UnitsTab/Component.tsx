import { Box, Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { UnitsTabProps } from "./interface";
import { BuildingIcon, EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import IconBox from "@/components/Cards/IconBox";
import React from "react";
import NewUnitModal from "@/components/Modals/NewUnitModal";
import EditUnitModal from "@/components/Modals/EditUnitModal";
import { IUnit } from "@/data/tableColumns";
import UnitPoliciesModal from "@/components/Modals/UnitPoliciesModal/Component";

export default function UnitsTab({ }: UnitsTabProps) {
  const [openNewUnitModal, setOpenNewUnitModal] = React.useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = React.useState(false);
  const [openUnitPoliciesModal, setOpenUnitPoliciesModal] = React.useState(false);

  const [selectedUnit, setSelectedUnit] = React.useState<IUnit | null>(null);

  const mockUnits = [
    {
      nome: "Unidade 1",
      status: "ativo",
      endereco: "Endereço da Unidade 1",
      responsavel: "João Silva",
      politicas: {
        horarios: {
          cafeManha: {
            inicio: "07:00",
            fim: "09:00",
          },
          almoco: {
            inicio: "12:00",
            fim: "14:00",
          },
          jantar: {
            inicio: "18:00",
            fim: "20:00",
          },
        },
        limites: {
          diario: 80,
          semanal: 400,
          mensal: 1600,
        },
      }
    },
    {
      nome: "Unidade 2",
      status: "ativo",
      endereco: "Endereço da Unidade 2",
      responsavel: "Maria Oliveira",
      politicas: {
        horarios: {
          cafeManha: {
            inicio: "07:00",
            fim: "09:00",
          },
          almoco: {
            inicio: "12:00",
            fim: "14:00",
          },
          jantar: {
            inicio: "18:00",
            fim: "20:00",
          },
        },
        limites: {
          diario: 100,
          semanal: 500,
          mensal: 2000,
        },
      }
    },
    {
      nome: "Unidade 3",
      status: "inativo",
      endereco: "Endereço da Unidade 3",
      responsavel: "Carlos Santos",
      politicas: {
        horarios: {
          cafeManha: {
            inicio: "08:00",
            fim: "10:00",
          },
          almoco: {
            inicio: "12:00",
            fim: "14:00",
          },
          jantar: {
            inicio: "18:00",
            fim: "20:00",
          },
        },
        limites: {
          diario: 50,
          semanal: 200,
          mensal: 800,
        },
      }
    },
  ];

  return (
    <>
      <Stack spacing={2} justifyContent={'space-between'} direction={'row'} alignItems={'center'} >
        <Typography variant="h6" fontWeight={'400'}>Unidades Cadastradas</Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{
            fontWeight: '400',
            paddingY: 1.5
          }}
          onClick={() => setOpenNewUnitModal(true)}
        >
          Nova Unidade
        </Button>
      </Stack>

      <Stack gap={2}>
        {mockUnits.map((unit, index) => (
          <Stack
            key={index}
            gap={2}
            direction={'row'}
            alignItems={'center'}
            border={'1px solid'}
            borderColor={'divider'}
            borderRadius={3}
            padding={2}
          >
            <IconBox
              icon={
                <BuildingIcon
                  color={unit.status === "ativo" ? "#00A63E" : "#6B7280"}
                  width={24}
                  height={24}
                />}
              bgColor={unit.status === "ativo" ? "#F0FDF4" : "background.default"} />
            <Stack gap={0.6}>
              <Box display="inline-flex" alignItems="center" height={18}>
                <Typography variant="body1">{unit.nome}</Typography>
                <Chip
                  label={unit.status}
                  color={unit.status === "ativo" ? "success" : "default"}
                  size="small"
                  sx={{ marginLeft: 1, textTransform: "capitalize", fontSize: 12 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">{unit.endereco}</Typography>
              <Typography variant="body2" color="#4A5565">Responsável: {unit.responsavel}</Typography>
            </Stack>

            <Stack direction={'row'} marginLeft={'auto'} gap={1} alignItems={'center'} flex={1} justifyContent={'flex-end'}>
              <Button
                variant="outlined"
                sx={{
                  minWidth: 0,
                  height: 40,
                  color: "#155DFC",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  display: "flex",
                  fontSize: 14,
                }}
                onClick={() => {
                  setSelectedUnit(unit);
                  setOpenUnitPoliciesModal(true)
                }}
              >
                Políticas
              </Button>
              <IconButton
                aria-label="edit"
                size="medium"
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: 'fit-content' }}
                onClick={() => {
                  setSelectedUnit(unit);
                  setOpenEditUnitModal(true);
                }}
              >
                <EditIcon width={22} height={22} />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="medium"
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: 'fit-content', color: 'error.contrastText' }}
                onClick={() => {
                  setSelectedUnit(unit);
                  // setOpenDeleteUnitModal(true)
                }}
              >
                <TrashIcon width={22} height={22} />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <NewUnitModal
        open={openNewUnitModal}
        onClose={() => setOpenNewUnitModal(false)}
      />
      <EditUnitModal
        open={openEditUnitModal}
        onClose={() => setOpenEditUnitModal(false)}
        unitItem={selectedUnit}
        onSave={() => { }}
      />
      <UnitPoliciesModal
        open={openUnitPoliciesModal}
        onClose={() => setOpenUnitPoliciesModal(false)}
        unitItem={selectedUnit}
        onSave={() => { }}
      />
    </>
  );
}
