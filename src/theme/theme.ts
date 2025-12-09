"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFFFFF",
      auth: "#FF3D00",
    },
    text: {
      primary: "#101828",
      secondary: "#6A7282",
      label: "#364153",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#FF3D00",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#992400ff",
          },
        },
      },
    },
  },
});
