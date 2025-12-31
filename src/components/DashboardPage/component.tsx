"use client";

import { Button, Stack, Typography, Grid, Box } from "@mui/material";
import { DashBoardPageProps, ModuleCard, IconBox, Last7DaysChart } from "./index";
import { DownloadIcon, ArrowIcon, FileIcon, CSVIcon } from "../Icons";
import { CardapiosIcon, RefeicoesIcon, EstoqueIcon, RelatoriosIcon, UsuariosIcon } from "../Sidebar/icons";
import React from "react";
import { CardGeneric, ModalGeneric } from "../Generics";

export function DashBoardPage({ }: DashBoardPageProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Stack gap={2}>

      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography fontSize={"42px"} fontWeight={"700"} color="#101828">
            Dashboard Operacional
          </Typography>
          <Typography color="#6A7282" fontSize={"18px"} fontWeight={"400"}>
            Visão geral das operações do dia
          </Typography>
        </Box>
        <Button
          sx={{
            width: "175px",
            borderRadius: "17px",
            height: "58px",
            color: "#FFFFFF",
            padding: "15px 32px",
            fontSize: "18px",
            fontWeight: "500"
          }}
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => setOpen(true)}
        >
          Exportar
        </Button>

        <ModalGeneric
          open={open}
          onClose={() => setOpen(false)}
          title="Exportar Relatório"
          subtitle="Escolha o formato de exportação"
        >
          <Stack gap={2}>
            <Stack direction={"row"} gap={2} border={"3px solid"} borderColor={"#98a8b380"} borderRadius={3} padding={2}>
              <IconBox
                icon={<FileIcon color="#FF0070" />}
                bgColor="#ff00701a"
                padding={2}
                borderRadius={3}
              />
              <Box component="span">
                <Typography fontSize={"16px"} fontWeight={"500"} color="#0C0813">
                  PDF
                </Typography>
                <Typography color="#6C757D" fontSize={"14px"} fontWeight={"400"}>
                  Relatório completo com gráficos e métricas
                </Typography>
              </Box>
            </Stack>

            <Stack direction={"row"} gap={2} border={"3px solid"} borderColor={"#98a8b380"} borderRadius={3} padding={2}>
              <IconBox
                icon={<CSVIcon color="#198754" />}
                bgColor="#B8EBAD"
                padding={2}
                borderRadius={3}
              />
              <Box component="span">
                <Typography fontSize={"16px"} fontWeight={"500"} color="#0C0813">
                  CSV
                </Typography>
                <Typography color="#6C757D" fontSize={"14px"} fontWeight={"400"}>
                  Dados em formato de tabela separada por vírgulas
                </Typography>
              </Box>
            </Stack>

            <Stack direction={"row"} gap={2}>
              <Button
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  color: "#98A8B3",
                  fontSize: "18px",
                  fontWeight: "500",
                  backgroundColor: "#FFF",
                  border: "1px solid",
                  borderColor: "#E5E7EB"
                }}

                onClick={() => { }}
              >
                Visualizar
              </Button>
              <Button
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: "500"
                }}
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => { }}
              >
                Baixar
              </Button>
            </Stack>
          </Stack>
        </ModalGeneric>

      </Stack>

      <Grid container gap={2}>
        <Grid size={{ xs: 12, sm: 6, md: "grow" }}>
          <ModuleCard
            icon={<CardapiosIcon color="#155DFC" />}
            iconBgColor="#EFF6FF"
            title="Cardápios"
            subtitle="Acesse o módulo"
            link="/cardapios"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: "grow" }}>
          <ModuleCard
            icon={<EstoqueIcon color="#9810FA" />}
            iconBgColor="#FAF5FF"
            title="Estoque"
            subtitle="Acesse o módulo"
            link="/estoque"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: "grow" }}>
          <ModuleCard
            icon={<RefeicoesIcon color="#009689" />}
            iconBgColor="#F0FDFA"
            title="Refeições"
            subtitle="Acesse o módulo"
            link="/refeicoes"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: "grow" }}>
          <ModuleCard
            icon={<RelatoriosIcon color="#EC003F" />}
            iconBgColor="#FFF1F2"
            title="Relatórios"
            subtitle="Acesse o módulo"
            link="/relatorios"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: "grow" }}>
          <ModuleCard
            icon={<UsuariosIcon color="#E17100" />}
            iconBgColor="#FFBEB"
            title="Usuários"
            subtitle="Acesse o módulo"
            link="/usuarios"
          />
        </Grid>

      </Grid>

      <CardGeneric>
        <Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
          Sem alertas críticos
        </Typography>
        <Typography fontSize="18px" fontWeight="400" color="#6A7282">
          Nenhum item atingiu o ponto de alerta.
        </Typography>
      </CardGeneric>

      <Stack direction={"row"} gap={2}>
        <CardGeneric>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box component="span">
              <Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
                Refeições Previstas
              </Typography>
              <Typography fontSize="18px" fontWeight="400" color="#6A7282">
                Ainda sem dados
              </Typography>
            </Box>
            <IconBox
              icon={<RefeicoesIcon color="#009689" />}
              bgColor="#F0FDFA"
              padding={2}
              borderRadius={3}
            />
          </Stack>
          <Typography fontSize="48px" fontWeight="400" color="#0A0A0A">–</Typography>
        </CardGeneric>
        <CardGeneric>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box component="span">
              <Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
                Refeições Servidas
              </Typography>
              <Typography fontSize="18px" fontWeight="400" color="#6A7282">
                Ainda sem dados
              </Typography>
            </Box>
            <IconBox
              icon={<RefeicoesIcon color="#155DFC" />}
              bgColor="#EFF6FF"
              padding={2}
              borderRadius={3}
            />
          </Stack>
          <Typography fontSize="48px" fontWeight="400" color="#0A0A0A">–</Typography>
        </CardGeneric>
      </Stack>

      <Stack direction={"row"} flexWrap="wrap" gap={2}>
        <CardGeneric>
          <Stack
            direction={"row"}
            borderBottom={"1px solid"}
            borderColor={"#F3F4F6"}
            justifyContent={"space-between"}
            paddingBottom={2}
            gap={2}
          >
            <Box component="span">
              <Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
                Cardápio do Dia
              </Typography>
              <Typography fontSize="18px" fontWeight="400" color="#6A7282">
                03/12/2025
              </Typography>
            </Box>
            <Typography
              fontSize="18px"
              fontWeight="500"
              color="#FF3D00"
              gap={0.5}
              sx={{
                display: "inline-flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Ver Cardápio Completo
              <ArrowIcon color="#FF3D00" />
            </Typography>
          </Stack>
          <Stack component="span" padding={3} alignItems={"center"}>
            <Typography fontSize="20px" fontWeight="400" color="#6A7282" >
              Nenhum cardápio programado
            </Typography>
          </Stack>
        </CardGeneric>

        <CardGeneric>
          <Stack
            direction={"row"}
            borderBottom={"1px solid"}
            borderColor={"#F3F4F6"}
            justifyContent={"space-between"}
            paddingBottom={2}
            gap={2}
          >
            <Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
              Alertas de Estoque
            </Typography>
            <Typography fontSize="18px" fontWeight="400" color="#6A7282">
              0 itens
            </Typography>
          </Stack>
          <Stack component="span" padding={3} alignItems={"center"}>
            <Typography fontSize="20px" fontWeight="400" color="#6A7282" >
              Nenhum cardápio programado
            </Typography>
            <Typography
              fontSize="18px"
              fontWeight="400"
              color="#FF3D00"
              sx={{
                display: "inline-flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Ver Estoque Completo
            </Typography>
          </Stack>
        </CardGeneric>

        <CardGeneric>
          <Typography
            fontSize="20px"
            fontWeight="400"
            color="#0A0A0A"
            borderBottom={"1px solid"}
            borderColor={"#F3F4F6"}
            paddingBottom={2}
          >
            Últimos 7 Dias
          </Typography>
          <Last7DaysChart />
        </CardGeneric>
      </Stack>
    </Stack>
  );
}
