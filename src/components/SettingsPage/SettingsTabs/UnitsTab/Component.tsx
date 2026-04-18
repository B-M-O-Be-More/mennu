import { Box, Button, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { UnitsTabProps } from "./interface";
import { BuildingIcon, EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import IconBox from "@/components/Cards/IconBox";
import React from "react";
import NewUnitModal from "@/components/Modals/NewUnitModal";
import EditUnitModal from "@/components/Modals/EditUnitModal";
import UnitPoliciesModal from "@/components/Modals/UnitPoliciesModal/Component";
import { IUnit } from "@/Interfaces/Unit/unit";
import useFetch from "@/hooks/useFetch/hook";

interface ApiUnidade {
  id: number;
  nome: string;
  endereco: string | null;
  ativo: boolean;
  status: string;
  responsavel: { nome?: string } | null;
  horario_abertura: string | null;
  horario_fechamento: string | null;
}

interface PaginatedUnidades {
  results: ApiUnidade[];
}

function mapApiToUnit(u: ApiUnidade): IUnit {
  return {
    id: u.id,
    nome: u.nome,
    endereco: u.endereco ?? "",
    responsavel: u.responsavel?.nome ?? "",
    status: u.ativo ? "ativo" : "inativo",
    horarioAbertura: u.horario_abertura?.slice(0, 5) ?? "",
    horarioFechamento: u.horario_fechamento?.slice(0, 5) ?? "",
    politicas: {
      horarios: {
        cafeManha: { inicio: "", fim: "" },
        almoco: { inicio: "", fim: "" },
        jantar: { inicio: "", fim: "" },
      },
      limites: { diario: 0, semanal: 0, mensal: 0 },
    },
  };
}

export default function UnitsTab({ }: UnitsTabProps) {
  const [units, setUnits] = React.useState<IUnit[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [openNewUnitModal, setOpenNewUnitModal] = React.useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = React.useState(false);
  const [openUnitPoliciesModal, setOpenUnitPoliciesModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<IUnit | null>(null);

  const [requestUnidades, isLoading] = useFetch<PaginatedUnidades>();

  React.useEffect(() => {
    requestUnidades("/api/unidades/", { method: "GET" })
      .then((resp) => {
        const raw = resp as unknown as PaginatedUnidades;
        setUnits((raw.results ?? []).map(mapApiToUnit));
      })
      .catch(() => setUnits([]));
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <>
      <Stack spacing={2} justifyContent={'space-between'} direction={'row'} alignItems={'center'}>
        <Typography variant="h6" fontWeight={'400'}>Unidades Cadastradas</Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{ fontWeight: '400', paddingY: 1.5 }}
          onClick={() => setOpenNewUnitModal(true)}
        >
          Nova Unidade
        </Button>
      </Stack>

      {isLoading ? (
        <Stack alignItems="center" py={4}><CircularProgress /></Stack>
      ) : (
        <Stack gap={2}>
          {units.map((unit, index) => (
            <Stack
              key={unit.id ?? index}
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
                bgColor={unit.status === "ativo" ? "#F0FDF4" : "background.default"}
              />
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
                {unit.responsavel && (
                  <Typography variant="body2" color="#4A5565">Responsável: {unit.responsavel}</Typography>
                )}
              </Stack>

              <Stack direction={'row'} marginLeft={'auto'} gap={1} alignItems={'center'} flex={1} justifyContent={'flex-end'}>
                <Button
                  variant="outlined"
                  sx={{ minWidth: 0, height: 40, color: "#155DFC", borderRadius: 3, display: "flex", fontSize: 14 }}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setOpenUnitPoliciesModal(true);
                  }}
                >
                  Políticas
                </Button>
                <Tooltip title="Editar unidade" arrow>
                  <IconButton
                    aria-label="edit"
                    size="medium"
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: 'fit-content', color: 'text.secondary' }}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setOpenEditUnitModal(true);
                    }}
                  >
                    <EditIcon width={22} height={22} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir unidade" arrow>
                  <IconButton
                    aria-label="delete"
                    size="medium"
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: 'fit-content', color: 'error.contrastText' }}
                  >
                    <TrashIcon width={22} height={22} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      <NewUnitModal
        open={openNewUnitModal}
        onClose={() => setOpenNewUnitModal(false)}
        onSuccess={refresh}
      />
      <EditUnitModal
        open={openEditUnitModal}
        onClose={() => setOpenEditUnitModal(false)}
        unitItem={selectedUnit}
        onSave={refresh}
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
