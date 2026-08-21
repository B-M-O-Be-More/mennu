"use client";

import { Button, Stack, Typography, Box, Chip, Divider } from "@mui/material";
import { ExtraRequestsPageProps } from "./index";
import { CircledCheckIcon, CircledXIcon, ClockIcon, DownloadIcon, FilterIcon, PaperIcon, PlusIcon, SearchIcon } from "../Icons";
import React from "react";
import Card from "../Cards/Card";
import IconBox from "../Cards/IconBox";
import { cardsExtraRequests } from "@/data/infos";
import Table from "../Tables/Table";
import { extraRequestColumns } from "@/data/tableColumns";
import Input from "../FormControl/Input";
import { useForm } from "react-hook-form";
import Select from "../FormControl/Select";
import { mockStatuses, mockUnidades, mockUsers } from "@/data/menuItems";
import NewExtraRequestModal from "../Modals/NewExtraRequestModal";
import ReviewExtraRequestModal from "../Modals/ReviewExtraRequestModal";
import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";
import { IUnit } from "@/Interfaces/Unit/unit";
import PageHeader from "../PageHeader";

const unitMock: IUnit = {
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

}

const mockExtraRequests: IExtraRequest[] = [
  {
    id: 1,
    data: "2026-01-15",
    tipo: "Alteração de Unidade",
    unidade: unitMock,
    usuario: {
      nome: "Victor Souza",
      matricula: "123456",
    },
    motivo: "Transferência para nova filial",
    status: "aprovado",
    resposta: {
      data: "2026-01-16",
      usuario: "Admin RH",
      comentario: "Solicitação aprovada sem restrições.",
    },
  },
  {
    id: 2,
    data: "2026-01-20",
    tipo: "Reemissão de Cartão",
    unidade: unitMock,
    usuario: {
      nome: "Maria Oliveira",
      matricula: "654321",
    },
    motivo: "Cartão perdido",
    status: "pendente",
    resposta: null,
  },
  {
    id: 3,
    data: "2026-01-22",
    tipo: "Mudança de Categoria",
    unidade: unitMock,
    usuario: {
      nome: "João Pereira",
      matricula: "112233",
    },
    motivo: "Promoção para categoria Premium",
    status: "reprovado",
    resposta: {
      data: "2026-01-23",
      usuario: "Supervisor",
      comentario: "Categoria não disponível para este usuário.",
    },
  },
  {
    id: 4,
    data: "2026-01-25",
    tipo: "Atualização de CPF",
    unidade: unitMock,
    usuario: {
      nome: "Ana Costa",
      matricula: "445566",
    },
    motivo: "Correção de dados cadastrais",
    status: "pendente",
    resposta: null,
  },
  {
    id: 5,
    data: "2026-01-28",
    tipo: "Alteração de Unidade",
    unidade: unitMock,
    usuario: {
      nome: "Carlos Mendes",
      matricula: "778899",
    },
    motivo: "Mudança de endereço residencial",
    status: "aprovado",
    resposta: {
      data: "2026-01-29",
      usuario: "Admin RH",
      comentario: "Solicitação aprovada.",
    },
  }
];


export function ExtraRequestsPage({ }: ExtraRequestsPageProps) {
  const [openTab, setOpenTab] = React.useState(0);

  const [_openExportExtraRequestModal, setOpenExportExtraRequestModal] = React.useState(false);
  const [openNewExtraRequestModal, setOpenNewExtraRequestModal] = React.useState(false);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);

  const [selectedRequest, setSelectedRequest] = React.useState<IExtraRequest>({} as IExtraRequest);
  const [reviewAction, setReviewAction] = React.useState<"aprovar" | "reprovar" | null>(null);

  console.log(_openExportExtraRequestModal)

  const { register, control } = useForm<{ search: string, user: string, unit: string, status: string }>({
    defaultValues: {
      search: "",
      user: mockUsers[0].value,
      unit: mockUnidades[0].value,
      status: mockStatuses[0].value,
    },
  });

  return (
    <Stack gap={2}>
      <PageHeader
        title="Solicitações Extras"
        subtitle="Gerencie pedidos extraordinários e exceções"
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => setOpenExportExtraRequestModal(true)}
        >
          Exportar
        </Button>

        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setOpenNewExtraRequestModal(true)}
        >
          Nova Solicitação
        </Button>
      </PageHeader>

      <NewExtraRequestModal open={openNewExtraRequestModal} onClose={() => setOpenNewExtraRequestModal(false)} />

      <Stack gap={2} direction={"row"}>
        <Button
          variant={openTab === 0 ? "contained" : "outlined"}
          startIcon={<ClockIcon width={22} height={22} />}
          onClick={() => setOpenTab(0)}
          sx={{ transition: "all .4s ease-in-out", color: openTab === 1 ? "#4A5565" : "" }}

        >
          Pendentes
          <Chip
            label={mockExtraRequests.filter((request) => request.status === "pendente").length}
            size="small"
            sx={{
              ml: 1,
              bgcolor: openTab === 0 ? "#FFFFFF" : "grey.200",
              color: "#4A5565",
              fontWeight: 500,
              paddingX: 0,
              borderRadius: "100%",
            }}
          />
        </Button>

        <Button
          variant={openTab === 1 ? "contained" : "outlined"}
          startIcon={<PaperIcon width={22} height={22} />}
          onClick={() => setOpenTab(1)}
          sx={{ transition: "all .4s ease-in-out", color: openTab === 0 ? "#4A5565" : "" }}

        >
          Histórico Completo
          <Chip
            label={mockExtraRequests.filter((request) => request.status !== "pendente").length}
            size="small"
            sx={{
              ml: 1,
              bgcolor: openTab === 0 ? "grey.200" : "#FFFFFF",
              color: "#4A5565",
              fontWeight: 500,
              paddingX: 0,
              borderRadius: "100%",
            }}
          />
        </Button>
      </Stack>

      <Card>
        <Stack direction="row" alignItems="center" gap={1}>
          <FilterIcon />
          <Typography >Filtros</Typography>
        </Stack>

        <Stack gap={2} direction={"row"}>
          <Input
            label="Buscar"
            placeholder="Nome, matrícula ou motivo..."
            icon={<SearchIcon />}
            register={register("search")}
          />
          <Select
            label="Usuário"
            options={mockUsers}
            name="user"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
          <Select
            label="Unidade"
            options={mockUnidades}
            name="unit"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
          <Select
            label="Status"
            options={mockStatuses}
            name="status"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
        </Stack>

        <Button variant="outlined" sx={{ width: "fit-content", padding: 1.2, borderRadius: 3 }}>Limpar Filtros</Button>
      </Card>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
      >
        {cardsExtraRequests.map((card, i) => (
          <Card key={i} flexDirection="row" alignItems="center" gap={2} paddingY={1.5}>
            <IconBox
              icon={card.icon}
              bgColor={card.bgColor}
              padding={1.5}
              borderRadius={4}
            />
            <Box>
              <Typography color="text.secondary" variant="body1" fontWeight={400}>
                {card.title}
              </Typography>
              <Typography variant="h4" fontWeight={400} color="text.primary">
                {card.value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Card>
        {openTab === 0 ? // tabs
          (
            <React.Fragment>
              <Stack direction={"row"} justifyContent={"space-between"} gap={2} alignItems={"center"}>
                <Typography>Solicitações Pendentes de Aprovação</Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockExtraRequests.filter(request => request.status === "pendente").length} aguardando análise
                </Typography>
              </Stack>
              <Stack gap={2}>
                {
                  mockExtraRequests.filter(request => request.status === "pendente").map((req, i) => (
                    <Card key={i} padding={2}>
                      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Stack direction={"row"} alignItems={"center"} gap={1} >
                          <Typography variant="body1">
                            {req.usuario.nome}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.label"
                            bgcolor={"grey.100"}
                            paddingX={1.2}
                            borderRadius={1}
                            align="center"
                          >
                            {req.id}
                          </Typography>
                          <Chip
                            label={req.status}
                            size="medium"
                            color="warning"
                            icon={<ClockIcon width={16} height={16} />}
                            sx={{
                              paddingY: 2,
                              fontSize: 14,
                              fontWeight: 400,
                              borderRadius: 4,
                              textTransform: "capitalize",
                            }}
                          />
                        </Stack>

                        <Stack direction={"row"} gap={2}>
                          <Button
                            startIcon={<CircledCheckIcon width={16} height={16} />}
                            sx={{
                              color: "success.contrastText",
                              backgroundColor: "success.main",
                              fontWeight: 500,
                              paddingX: 2.6,
                              borderRadius: 3,
                              transition: "transform .1s ease-in-out",
                              ":hover": {
                                transform: "translateY(-2px)",
                              }
                            }}
                            onClick={() => {
                              setSelectedRequest(req);
                              setReviewAction("aprovar");
                              setReviewModalOpen(true);
                            }}
                          >
                            Aprovar
                          </Button>
                          <Button
                            startIcon={<CircledXIcon width={16} height={16} />}
                            sx={{
                              color: "error.contrastText",
                              backgroundColor: "error.main",
                              fontWeight: 500,
                              paddingX: 2.6,
                              borderRadius: 3,
                              transition: "transform .1s ease-in-out",
                              ":hover": {
                                transform: "translateY(-2px)",
                              }
                            }}
                            onClick={() => {
                              setSelectedRequest(req);
                              setReviewAction("reprovar");
                              setReviewModalOpen(true);
                            }}
                          >
                            Reprovar
                          </Button>
                        </Stack>
                      </Stack>
                      <Box borderBottom={"divider"}>
                        <Typography fontWeight={400} color="text.label">
                          {req.unidade.nome}
                        </Typography>
                        <Typography variant="caption" fontWeight={400} color="text.secondary">
                          Solicitado em: {req.data}
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: "grey.100" }} />
                        <Typography variant="caption" fontWeight={400} color="text.secondary">
                          Motivo:
                        </Typography>
                        <Typography fontWeight={400}>
                          {req.motivo}
                        </Typography>
                      </Box>
                    </Card>
                  ))
                }
              </Stack>
              {
                reviewModalOpen &&
                <ReviewExtraRequestModal
                  open={reviewModalOpen}
                  onClose={() => setReviewModalOpen(false)}
                  extraRequest={selectedRequest}
                  isApprove={reviewAction === "aprovar"}
                />
              }

            </React.Fragment>
          ) :
          (
            <React.Fragment>
              <Stack direction={"row"} justifyContent={"space-between"} gap={2} alignItems={"center"}>
                <Typography>Histórico Completo de Solicitações</Typography>
                <Typography variant="caption" color="text.secondary">6 registros</Typography>
              </Stack>

              <Table columns={extraRequestColumns} rows={mockExtraRequests} initialRowsPerPage={5} />
            </React.Fragment>
          )
        }
      </Card>
    </Stack>
  );
}
