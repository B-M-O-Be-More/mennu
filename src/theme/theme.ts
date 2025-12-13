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
  typography: {
    fontFamily: 'var(--font-poppins), "Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h4: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h5: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 500,
      fontSize: "1rem",
    },
    h6: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    body1: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: "1rem",
    },
    body2: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    caption: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 400,
      fontSize: "0.75rem",
    },
    overline: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
      fontSize: "0.625rem",
    },
    button: {
      fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#FF3D00",
          color: "#FFFFFF",
          fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#992400ff",
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        style: {
          fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
        },
      },
    },
  },
});
