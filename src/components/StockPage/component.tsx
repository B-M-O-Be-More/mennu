"use client";

import { Stack, Typography, Box, Button, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DownloadIcon, EstoqueIcon, PaperIcon, PlusIcon, SearchIcon, UpdateIcon } from "../Icons";
import { StockPageProps } from "./";
import Card from "../Cards/Card";
import Table from "../Tables/Table";
import { movementColumns, stockColumns } from "@/data/tableColumns";
import Input from "../FormControl/Input";
import IconBox from "../Cards/IconBox";
import { cardsStock } from "@/data/infos";
import NewStockModal from "../Modals/NewStockModal";
import ActionCell from "../ActionCell";
import EditStockModal from "../Modals/EditStockModal";
import NewMovementModal from "../Modals/NewMovementModal";
import { useForm } from "react-hook-form";
import { IStock } from "@/Interfaces/Stock/stock";
import { IMovement } from "@/Interfaces/Movement/movement";
import PageHeader from "../PageHeader";
import { useDebounce } from "@/hooks/useDebounce/hook";

export const stockMock: IStock[] = [
  {
    item: "Arroz Branco",
    categoria: "Alimentos",
    saldo: "120",
    estoqueMinimo: "50",
    unidade: "Kg",
    unidadeMedida: "kg",
    status: true,
  },
  {
    item: "Feijão Carioca",
    categoria: "Alimentos",
    saldo: "30",
    estoqueMinimo: "60",
    unidadeMedida: "kg",
    unidade: "Kg",
    status: false,
  },
];

export const mockMovements: IMovement[] = [
  {
    data: "10/01/2026",
    tipo: "entrada",
    item: "Arroz Branco",
    quantidade: 50,
    responsavel: "João Silva",
    justificativa: "Motivo da entrada",
  },
  {
    data: "11/01/2026",
    tipo: "saida",
    item: "Feijão Carioca",
    quantidade: 20,
    responsavel: "Maria Oliveira",
    justificativa: "Motivo da saída",
  },
  {
    data: "12/01/2026",
    tipo: "perda",
    item: "Óleo de Soja",
    quantidade: 5,
    responsavel: "Carlos Santos",
    justificativa: "Motivo do ajuste",
  },
  {
    data: "13/01/2026",
    tipo: "ajuste",
    item: "Açúcar Refinado",
    quantidade: 15,
    responsavel: "Ana Costa",
    justificativa: "Motivo da saída",
  },
];

export function StockPage({}: StockPageProps) {
  const [openTab, setOpenTab] = React.useState(0);

  const [openEditStockModal, setOpenEditStockModal] = React.useState(false);
  const [_openExportStockModal, setOpenExportStockModal] = React.useState(false);
  const [openNewStockModal, setOpenNewStockModal] = React.useState(false);
  const [openNewMovementModal, setOpenNewMovementModal] = React.useState(false);

  const [selectedStock, setSelectedStock] = React.useState<IStock | null>(null);
  const [stockData, setStockData] = useState<IStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, watch } = useForm<{ itemSearch: string }>({
    defaultValues: { itemSearch: "" },
  });

  const searchTerm = watch("itemSearch");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadStockData = async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search ? `/api/insumo?search=${encodeURIComponent(search)}` : "/api/insumo";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao carregar insumos");
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openTab === 0) {
      loadStockData(debouncedSearch);
    }
  }, [openTab, debouncedSearch]);

  const handleDeleteStock = async (stock: IStock) => {
    if (!stock.id) return;
    try {
      const response = await fetch(`/api/insumo/${stock.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir insumo");
      loadStockData(debouncedSearch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  const handleEditStock = (stock: IStock) => {
    setSelectedStock(stock);
    setOpenEditStockModal(true);
  };

  const handleSaveStock = () => {
    loadStockData(debouncedSearch);
  };

  return (
    <Stack gap={2}>
      <PageHeader title="Estoque" subtitle="Gerencie insumos e movimentações">
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
      </PageHeader>

      <Stack gap={2} direction="row">
        <Button
          variant={openTab === 0 ? "contained" : "outlined"}
          startIcon={<EstoqueIcon width={22} height={22} />}
          onClick={() => setOpenTab(0)}
          sx={{ transition: "all .4s ease-in-out", color: openTab === 1 ? "#4A5565" : "" }}
        >
          Itens de Estoque
        </Button>
        <Button
          variant={openTab === 1 ? "contained" : "outlined"}
          startIcon={<PaperIcon width={22} height={22} />}
          onClick={() => setOpenTab(1)}
          sx={{ transition: "all .4s ease-in-out", color: openTab === 0 ? "#4A5565" : "" }}
        >
          Movimentações
        </Button>
      </Stack>

      <Box display="grid" gap={2} gridTemplateColumns="repeat(auto-fit, minmax(236px, 1fr))">
        {cardsStock.map((card, i) => (
          <Card key={i} spacing={0}>
            <Stack
              alignItems="center"
              direction="row"
              gap={2}
              justifyContent="space-between"
              width="100%"
            >
              <Box>
                <Typography color="text.primary" variant="body1" fontWeight={400}>
                  {card.title}
                </Typography>
                <Typography color="text.secondary" variant="body2" fontWeight={400}>
                  {card.subtitle}
                </Typography>
              </Box>
              <IconBox icon={card.icon} bgColor={card.bgColor} />
            </Stack>
            <Typography variant="h4" fontWeight={400} color="text.primary">
              {card.value}
            </Typography>
          </Card>
        ))}
      </Box>

    
      <Card>
        {openTab === 0 ? (
          <React.Fragment>
            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
              <Typography>Itens Cadastrados</Typography>
              <Stack direction="row" gap={2} minWidth="450px">
                <Input
                  placeholder="Buscar item..."
                  icon={<SearchIcon />}
                  register={register("itemSearch")}
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
                  onClose={() => {
                    setOpenNewStockModal(false);
                    loadStockData(debouncedSearch);
                  }}
                />
              </Stack>
            </Stack>

            <Table
              columns={stockColumns.map((col) =>
                col.key === "acoes"
                  ? {
                      ...col,
                      render: (row: IStock) => (
                        <ActionCell
                          checked={row.ativo}
                          tooltipToggle="Ativar/Desativar item"
                          onToggle={(newState) => console.log("Switch:", newState)}
                          tooltipEdit="Editar item"
                          onEdit={() => handleEditStock(row)}
                          tooltipDelete="Excluir item"
                          onDelete={() => handleDeleteStock(row)}
                        />
                      ),
                    }
                  : col
              )}
              rows={stockData}
              initialRowsPerPage={5}
              loading={loading}
            />

            <EditStockModal
              open={openEditStockModal}
              onClose={() => setOpenEditStockModal(false)}
              stockItem={selectedStock}
              onSave={handleSaveStock}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
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
        )}
      </Card>
    </Stack>
  );
}