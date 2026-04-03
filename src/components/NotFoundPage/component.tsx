"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Cards/Card";
import { useUser } from "@/context/AuthContext";
import { NotFoundPageProps } from "./interface";

const suggestions = [
  {
    id: "refeicoes",
    href: "/refeicoes",
    title: "Pratos",
    description: "Gerencie os pratos e suas receitas",
    icon: RestaurantOutlinedIcon,
  },
  {
    id: "cardapios",
    href: "/cardapios",
    title: "Cardápios",
    description: "Gerencie os cardápios das refeições",
    icon: RestaurantMenuOutlinedIcon,
  },
  {
    id: "cardapio-programado",
    href: "/cardapios",
    title: "Cardápio Programado",
    description: "Visualize cardápios programados",
    icon: CalendarMonthOutlinedIcon,
  },
  {
    id: "estoque",
    href: "/estoque",
    title: "Estoque",
    description: "Acompanhe a disponibilidade de ingredientes",
    icon: Inventory2OutlinedIcon,
  },
] as const;

export function NotFoundPage({}: NotFoundPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 672,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Main error card */}
        <Card
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            boxShadow:
              "0px 10px 15px 0px rgba(0,0,0,0.1), 0px 4px 6px 0px rgba(0,0,0,0.1)",
            minHeight: { xs: 340, md: 360 },
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2.5, md: 5 },
            py: { xs: 3.5, md: 4 },
          }}
        >
          {/* Large background 404 */}
          <Typography
            aria-hidden="true"
            sx={{
              position: "absolute",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(96px, 16vw, 200px)",
              color: "#ff3d00",
              opacity: 0.08,
              lineHeight: 1,
              userSelect: "none",
              top: "70%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            404
          </Typography>
 
          {/* Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Icon circle */}
            <Box
              sx={{
                bgcolor: "#fff0ed",
                borderRadius: "50%",
                width: { xs: 78, md: 88 },
                height: { xs: 78, md: 88 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: { xs: 40, md: 46 }, color: "#ff3d00" }} />
            </Box>
 
            {/* Title */}
            <Typography
              component="h1"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: { xs: "30px", md: "34px" },
                lineHeight: "40px",
                color: "#101828",
                textAlign: "center",
                mb: 1,
              }}
            >
              Página Não Encontrada
            </Typography>
 
            {/* Description */}
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: { xs: "16px", md: "18px" },
                lineHeight: "28px",
                color: "#6a7282",
                textAlign: "center",
                maxWidth: 574,
                mb: 2.5,
              }}
            >
              Desculpe, a página que você está procurando não existe ou foi movida.
            </Typography>
 
            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
                type="button"
                onClick={() => router.back()}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  textTransform: "none",
                  color: "#0a0a0a",
                  borderColor: "#e5e7eb",
                  borderRadius: "16px",
                  height: 56,
                  px: 3,
                  "&:hover": {
                    borderColor: "#d1d5db",
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                Voltar
              </Button>
 
              <Button
                variant="contained"
                startIcon={<HomeIcon sx={{ fontSize: 20 }} />}
                component={NextLink}
                href={isAuthenticated ? "/dashboard" : "/"}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  textTransform: "none",
                  bgcolor: "#ff3d00",
                  borderRadius: "16px",
                  height: 56,
                  px: 3,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#e63600",
                    boxShadow: "none",
                  },
                }}
              >
                Ir para Início
              </Button>
            </Box>
          </Box>
        </Card>
 
        {/* Suggestions card */}
        <Card
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            pt: 2.5,
            px: 3,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "28px",
              color: "#0a0a0a",
              textAlign: "center",
              mb: 1.5,
            }}
          >
            Você pode estar procurando por:
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            {suggestions.map(({ id, href, title, description, icon: Icon }) => (
              <Card
                key={id}
                component={NextLink}
                href={href}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  p: 2,
                  textDecoration: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "#ff3d00",
                    boxShadow: "0 1px 4px rgba(255,61,0,0.12)",
                  },
                  "&:hover .suggestion-title": { color: "#ff3d00" },
                  "&:hover .suggestion-icon": { color: "#ff3d00" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Icon
                    className="suggestion-icon"
                    sx={{
                      fontSize: 18,
                      color: "#6a7282",
                      transition: "color 0.2s",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    className="suggestion-title"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#0a0a0a",
                      transition: "color 0.2s",
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#6a7282",
                    letterSpacing: "-0.15px",
                  }}
                >
                  {description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>
 
        {/* Footer note */}
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#6a7282",
            textAlign: "center",
          }}
        >
          Se você acredita que isso é um erro, entre em contato com o suporte.
        </Typography>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
