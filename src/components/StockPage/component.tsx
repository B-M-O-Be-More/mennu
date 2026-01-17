"use client";

import { Stack, Typography, Box, Button, Chip } from "@mui/material";
import React from "react";
import { DownloadIcon, PaperIcon, PlusIcon, SearchIcon, UpdateIcon } from "../Icons";
import { StockPageProps } from "./";
import Card from "../Cards/Card";
import Table from "../Tables/Table";
import { IMovement, movementColumns, stockColumns } from "@/data/tableColumns";
import Input from "../FormControl/Input";
import IconBox from "../Cards/IconBox";
import { cardsStock } from "@/data/infos";
import { EstoqueIcon } from "../Sidebar/icons";
import NewStockModal from "../Modals/NewStockModal";
import ActionCell from "../ActionCell";
import EditStockModal from "../Modals/EditStockModal";
import NewMovementModal from "../Modals/NewMovementModal";
import { useForm } from "react-hook-form";

export const getStockMock = (onEdit: () => void) => [
  {
    item: "Arroz Branco",
    categoria: "Alimentos",
    saldo: "120",
    estoqueMinimo: "50",
    unidade: "Kg",
    unidadeMedida: "kg",
    status: <Chip label="OK" color="success" size="small" />,
    acoes: (
      <ActionCell
        checked={true}
        onToggle={(newState) => console.log("Switch:", newState)}
        onEdit={onEdit}
      />
    ),
  },
  {
    item: "Feijão Carioca",
    categoria: "Alimentos",
    saldo: "30",
    estoqueMinimo: "60",
    unidadeMedida: "kg",
    unidade: "Kg",
    status: <Chip label="Baixo" color="warning" size="small" />,
    acoes: (
      <ActionCell
        checked={true}
        onToggle={(newState) => console.log("Switch:", newState)}
        onEdit={onEdit}
      />
    ),
  },
  {
    item: "Detergente Neutro",
    categoria: "Limpeza",
    saldo: "10",
    estoqueMinimo: "20",
    unidadeMedida: "kg",
    unidade: "Un",
    status: <Chip label="Crítico" color="error" size="small" />,
    acoes: (
      <ActionCell
        checked={true}
        onToggle={(newState) => console.log("Switch:", newState)}
        onEdit={onEdit}
      />
    ),
  },
];

const stockMock =
{
  item: "Arroz Branco",
  categoria: "Alimentos",
  saldo: "120",
  estoqueMinimo: "50",
  unidadeMedida: "Kg",
  unidade: "Unidade 1",
  status: true,
}

export const mockMovements: IMovement[] = [
  {
    data: "10/01/2026",
    tipo: "Entrada",
    item: "Arroz Branco",
    quantidade: 50,
    responsavel: "João Silva",
    justificativa: "Motivo da entrada",
  },
  {
    data: "11/01/2026",
    tipo: "Saída",
    item: "Feijão Carioca",
    quantidade: 20,
    responsavel: "Maria Oliveira",
    justificativa: "Motivo da saída",
  },
  {
    data: "12/01/2026",
    tipo: "Ajuste",
    item: "Óleo de Soja",
    quantidade: 5,
    responsavel: "Carlos Santos",
    justificativa: "Motivo do ajuste",
  },
  {
    data: "13/01/2026",
    tipo: "Saída",
    item: "Açúcar Refinado",
    quantidade: 15,
    responsavel: "Ana Costa",
    justificativa: "Motivo da saída",
  },
];

export function StockPage({ }: StockPageProps) {
  const [openTable, setOpenTable] = React.useState(0);

  const [openEditStockModal, setOpenEditStockModal] = React.useState(false);
  const [_openExportStockModal, setOpenExportStockModal] = React.useState(false);
  const [openNewStockModal, setOpenNewStockModal] = React.useState(false);
  const [openNewMovementModal, setOpenNewMovementModal] = React.useState(false);

  const { register, watch } = useForm<{ itemSearch: string }>({
    defaultValues: { itemSearch: "" },
  });

  return (
    <Stack gap={2}>

      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography variant="h1" fontWeight={"600"} color="text.primary">
            Estoque
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
            Gerencie insumos e movimentações
          </Typography>
        </Box>

        <Stack gap={2} direction={"row"}>
          <Button
            variant="outlined"
            startIcon={<UpdateIcon />}
            onClick={() => setOpenEditStockModal(true)}
          >
            Atualizar
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setOpenExportStockModal(true)}
          >
            Exportar
          </Button>
        </Stack>
      </Stack>

      <Stack gap={2} direction={"row"}>
        <Button
          variant={openTable === 0 ? "contained" : "outlined"}
          startIcon={<EstoqueIcon width={22} />}
          onClick={() => setOpenTable(0)}
          sx={{ transition: "all .4s ease-in-out", color: openTable === 1 ? "#4A5565" : "" }}
        >
          Itens de Estoque
        </Button>

        <Button
          variant={openTable === 1 ? "contained" : "outlined"}
          startIcon={<PaperIcon width={20} />}
          onClick={() => setOpenTable(1)}
          sx={{ transition: "all .4s ease-in-out", color: openTable === 0 ? "#4A5565" : "" }}

        >
          Movimentações
        </Button>
      </Stack>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(236px, 1fr))"
      >
        {cardsStock.map((card, i) => (
          <Card key={i} spacing={0}>
            <Stack alignItems={"center"} direction="row" gap={2} justifyContent={"space-between"} width={"100%"}>
              <Box>
                <Typography color="text.primary" variant="h5" fontWeight={400}>
                  {card.title}
                </Typography>
                <Typography color="text.secondary" variant="h6" fontWeight={400}>
                  {card.subtitle}
                </Typography>
              </Box>

              <IconBox
                icon={card.icon}
                bgColor={card.bgColor}
              />
            </Stack>
            <Typography variant="h2" fontWeight={400} color="text.primary">
              {card.value}
            </Typography>
          </Card>
        ))}
      </Box>
      <Card>
        {openTable === 0 ? //tabs
          (
            <React.Fragment>
              <Stack direction={"row"} justifyContent={"space-between"} gap={2} alignItems={"center"}>
                <Typography>Itens Cadastrados</Typography>
                <Stack direction={"row"} gap={2} minWidth={"450px"}>
                  <Input
                    placeholder="Buscar item..."
                    icon={<SearchIcon />}
                    register={register("itemSearch")}
                    error={undefined}
                  />
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => setOpenNewStockModal(true)}
                    sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
                  >
                    Novo Item
                  </Button>
                  <NewStockModal
                    open={openNewStockModal}
                    onClose={() => setOpenNewStockModal(false)}
                  />
                </Stack>
              </Stack>

              <Table columns={stockColumns} rows={getStockMock(() => setOpenEditStockModal(true))} initialRowsPerPage={5} />
              <EditStockModal
                open={openEditStockModal}
                onClose={() => setOpenEditStockModal(false)}
                stockItem={stockMock}
                onSave={() => { }}
              />
            </React.Fragment>
          ) :
          (
            <React.Fragment>
              <Stack direction={"row"} justifyContent={"space-between"} gap={2} alignItems={"center"}>
                <Typography>Histórico de Movimentações</Typography>

                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={() => setOpenNewMovementModal(true)}
                  sx={{ height: "50px", whiteSpace: "nowrap", paddingX: "2rem" }}
                >
                  Nova Movimentação
                </Button>
                <NewMovementModal
                  open={openNewMovementModal}
                  onClose={() => setOpenNewMovementModal(false)}
                />
              </Stack>

              <Table columns={movementColumns} rows={mockMovements} initialRowsPerPage={5} />
            </React.Fragment>
          )
        }
      </Card>

    </Stack >

  );
}
