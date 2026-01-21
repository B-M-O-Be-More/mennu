"use client";

import { createTheme, responsiveFontSizes, alpha } from "@mui/material/styles";

const palette = {
  mode: "light" as const,
  primary: {
    main: "#FF3D00",
    light: "#FF5C26",
    dark: "#CC3100",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#101828",
    light: "#1D2433",
    dark: "#0A0F1A",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#FEF2F2",
    light: "#F87171",
    dark: "#B91C1C",
    contrastText: "#E7000B",
  },
  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#B45309",
    contrastText: "#0A0A0A",
  },
  info: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0369A1",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#F0FDF4",
    light: "#4ADE80",
    dark: "#16A34A",
    contrastText: "#008236",
  },
  grey: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  background: {
    default: "#F9FAFB",
    paper: "#FFFFFF",
    auth: "#FF3D00",
  },
  text: {
    primary: "#101828",
    secondary: "#6A7282",
    label: "#364153",
  },
  divider: "#E5E7EB",
  sidebar: {
    text: "#4A5565",
    textActive: "#FF3D00",
    background: "#FFFFFF",
    bgActive: "rgba(255, 61, 0, 0.08)",
    bgHover: "rgba(0, 0, 0, 0.04)",
    bgActiveHover: "rgba(255, 61, 0, 0.12)",
    indicator: "#FF3D00",
    section: "#99A1AF",
    divider: "#E5E7EB",
    userNameColor: "#0A0A0A",
    userEmailColor: "#6A7282",
  },
  tables: {
    text: "#4A5565",
  }
};

const typography = {
  fontFamily: 'var(--font-poppins), "Poppins", "Helvetica", "Arial", sans-serif',
  h1: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 700
  },
  h2: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 600
  },
  h3: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 600
  },
  h4: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 600
  },
  h5: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 500
  },
  h6: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 500
  },
  body1: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 400
  },
  body2: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 400
  },
  caption: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 400
  },
  overline: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 600
  },
  button: {
    fontFamily: 'var(--font-poppins), "Poppins", sans-serif',
    fontWeight: 600,
    textTransform: "none" as const,
  },
};

const baseTheme = createTheme({
  palette,
  typography,
});

export const theme = createTheme(baseTheme, {
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: baseTheme.palette.primary.main,
          color: baseTheme.palette.primary.contrastText,
          border: "px solid",
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          height: "fit-content",
          padding: "1rem 1.5rem",
          borderRadius: "1rem",
          "&:hover": {
            backgroundColor: baseTheme.palette.primary.dark,
          },
          outlineOffset: "0px",
          outline: "1px solid",
          outlineColor: 'transparent',
        },
        outlined: {
          backgroundColor: "transparent",
          color: baseTheme.palette.secondary.main,
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          height: "fit-content",
          padding: "1rem 1.5rem",
          borderRadius: "1rem",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          border: "0px solid",
          outlineOffset: "0px",
          outline: "1px solid",
          outlineColor: baseTheme.palette.divider,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        style: {
          fontFamily: typography.fontFamily,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          height: 26,
          padding: 0,
        },

        switchBase: {
          padding: 3,
          "&.Mui-checked": {
            transform: "translateX(32px)",
            color: "#fff",

            "& + .MuiSwitch-track": {
              backgroundColor: baseTheme.palette.primary.main,
              opacity: 1,
            },
          },
        },

        thumb: {
          width: 20,
          height: 20,
        },

        track: {
          borderRadius: 13,
          backgroundColor: baseTheme.palette.grey[300],
          opacity: 1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          textTransform: "none",
          borderRadius: 8,
          height: 24,
          padding: "0 8px",
        },
        colorPrimary: {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          "&.MuiChip-clickable:hover": {
            backgroundColor: palette.primary.dark,
          },
        },
        colorSecondary: {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
        },
        colorSuccess: {
          backgroundColor: palette.success.main,
          color: palette.success.contrastText,
        },
        colorError: {
          backgroundColor: palette.error.main,
          color: palette.error.contrastText,
        },
        colorDefault: {
          backgroundColor: palette.background.default,
          color: palette.text.label,
        },
        colorWarning: {
          backgroundColor: palette.warning.main,
          color: palette.warning.contrastText,
        },
        colorInfo: {
          backgroundColor: palette.info.main,
          color: palette.info.contrastText,
        },
        outlined: {
          border: `1px solid ${palette.divider}`,
          backgroundColor: "transparent",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default responsiveFontSizes(theme);