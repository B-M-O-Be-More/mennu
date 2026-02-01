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
    dark: "#82181A",
    contrastText: "#E7000B",
  },
  warning: {
    main: "#FFFBEB",
    light: "#FEE685",
    dark: "#7B3306",
    contrastText: "#BB4D00",
  },
  info: {
    main: "#EFF6FF",
    light: "#BEDBFF",
    dark: "#1C398E",
    contrastText: "#1447E6",
  },
  success: {
    main: "#F0FDF4",
    light: "#00A63E",
    dark: "#0D542B",
    contrastText: "#008236",
  },
  default: {
    main: "#E9E9E9",
    light: "#FFFFFF",
    dark: "#6A7282",
    contrastText: "#6A7282",
  },
  purple: {
    main: "#FAF5FF",
    light: "#FFFFFF",
    dark: "#6A7282",
    contrastText: "#8200DB",
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
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          height: "fit-content",
          padding: ".8rem 1.5rem",
          transition: "0.2s ease",
          borderRadius: "1rem",
          border: "0px solid",
          "&:hover": {
            backgroundColor: baseTheme.palette.primary.dark,
          },
          "&.Mui-disabled": {
            border: "0px solid",
            backgroundColor: baseTheme.palette.grey[500],
            color: baseTheme.palette.primary.contrastText,
          },
        },
        outlined: {
          backgroundColor: "transparent",
          color: baseTheme.palette.secondary.main,
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          height: "fit-content",
          padding: ".8rem 1.5rem",
          transition: "0.2s ease",
          borderRadius: "1rem",
          border: "0px solid",
          outlineOffset: "0px",
          outline: "1px solid",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          outlineColor: baseTheme.palette.divider,
          "&.Mui-disabled": {
            border: "0px solid",
            color: baseTheme.palette.grey[300],
          },
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
          backgroundColor: palette.default.main,
          color: palette.default.contrastText,
        },
        colorWarning: {
          backgroundColor: palette.warning.main,
          color: palette.warning.contrastText,
        },
        colorInfo: {
          backgroundColor: palette.info.main,
          color: palette.info.contrastText,
        },
        colorPurple: {
          backgroundColor: palette.purple.main,
          color: palette.purple.contrastText,
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