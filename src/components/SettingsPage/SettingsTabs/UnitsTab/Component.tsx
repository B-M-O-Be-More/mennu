"use client";

import { Alert, Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { BuildingIcon, EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import IconBox from "@/components/Cards/IconBox";
import NewUnitModal from "@/components/Modals/NewUnitModal";
import EditUnitModal from "@/components/Modals/EditUnitModal";
import UnitPoliciesModal from "@/components/Modals/UnitPoliciesModal/Component";
import { UnitListItem } from "@/Interfaces/Settings/settings";
import { settingsService } from "@/services/settingsService";
import { UnitsTabProps } from "./interface";

export default function UnitsTab({}: UnitsTabProps) {
  const [openNewUnitModal, setOpenNewUnitModal] = React.useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = React.useState(false);
  const [openUnitPoliciesModal, setOpenUnitPoliciesModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitListItem | null>(null);
  const [units, setUnits] = React.useState<UnitListItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadUnits = React.useCallback(async () => {
    setError(null); setIsLoading(true);
    try { setUnits(await settingsService.listUnits()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Erro ao carregar unidades"); }
    finally { setIsLoading(false); }
  }, []);

  React.useEffect(() => { void loadUnits(); }, [loadUnits]);

  const handleDelete = async (unit: UnitListItem) => {
    if (!window.confirm(`Excluir a unidade "${unit.nome}"?`)) return;
    try { await settingsService.deleteUnit(unit.id); await loadUnits(); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "Erro ao excluir unidade"); }
  };

  return <>
    <Stack spacing={2} justifyContent="space-between" direction="row" alignItems="center"><Typography variant="h6" fontWeight={400}>Unidades Cadastradas</Typography><Button variant="contained" startIcon={<PlusIcon />} sx={{ fontWeight: 400, paddingY: 1.5 }} onClick={() => setOpenNewUnitModal(true)}>Nova Unidade</Button></Stack>
    {error && <Alert severity="error">{error}</Alert>}
    {isLoading ? <Typography color="text.secondary">Carregando unidades...</Typography> : <Stack gap={2}>{units.map((unit) => <Stack key={unit.id} gap={2} direction="row" alignItems="center" border="1px solid" borderColor="divider" borderRadius={3} padding={2}>
      <IconBox icon={<BuildingIcon color={unit.ativo ? "#00A63E" : "#6B7280"} width={24} height={24} />} bgColor={unit.ativo ? "#F0FDF4" : "background.default"} />
      <Stack gap={0.6}><Box display="inline-flex" alignItems="center" height={18}><Typography variant="body1">{unit.nome}</Typography><Chip label={unit.status} color={unit.ativo ? "success" : "default"} size="small" sx={{ marginLeft: 1, textTransform: "capitalize", fontSize: 12 }} /></Box><Typography variant="body2" color="text.secondary">{unit.endereco}</Typography><Typography variant="body2" color="#4A5565">Responsável: {unit.responsavelNome}</Typography></Stack>
      <Stack direction="row" marginLeft="auto" gap={1} alignItems="center" flex={1} justifyContent="flex-end"><Button variant="outlined" sx={{ minWidth: 0, height: 40, color: "#155DFC", borderRadius: 3, fontSize: 14 }} onClick={() => { setSelectedUnit(unit); setOpenUnitPoliciesModal(true); }}>Políticas</Button><Tooltip title="Editar unidade" arrow><IconButton aria-label="Editar unidade" size="medium" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, color: "text.secondary" }} onClick={() => { setSelectedUnit(unit); setOpenEditUnitModal(true); }}><EditIcon width={22} height={22} /></IconButton></Tooltip><Tooltip title="Excluir unidade" arrow><IconButton aria-label="Excluir unidade" size="medium" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, color: "error.contrastText" }} onClick={() => void handleDelete(unit)}><TrashIcon width={22} height={22} /></IconButton></Tooltip></Stack>
    </Stack>)}</Stack>}
    <NewUnitModal open={openNewUnitModal} onClose={() => setOpenNewUnitModal(false)} onCreated={loadUnits} />
    <EditUnitModal open={openEditUnitModal} onClose={() => setOpenEditUnitModal(false)} unitItem={selectedUnit} onSaved={loadUnits} />
    <UnitPoliciesModal open={openUnitPoliciesModal} onClose={() => setOpenUnitPoliciesModal(false)} unitItem={selectedUnit} onSaved={loadUnits} />
  </>;
}
