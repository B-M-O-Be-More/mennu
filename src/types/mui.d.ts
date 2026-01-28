import "@mui/material/styles";
import "@mui/material/Button";
import "@mui/material/Chip";

declare module "@mui/material/styles" {
  interface TypeBackground {
    auth?: string;
  }
  interface TypeText {
    label?: string;
  }
  interface Palette {
    default: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    purple: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    sidebar: {
      text: string;
      textActive: string;
      background: string;
      bgActive: string;
      bgHover: string;
      bgActiveHover: string;
      indicator: string;
      section: string;
      divider: string;
      userNameColor: string;
      userEmailColor: string;
    };
    tables: {
      text: string;
    };
  }
  interface PaletteOptions {
    default: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    purple: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    sidebar?: {
      text?: string;
      textActive?: string;
      background?: string;
      bgActive?: string;
      bgHover?: string;
      bgActiveHover?: string;
      indicator?: string;
      section?: string;
      divider?: string;
      userNameColor?: string;
      userEmailColor?: string;
    };
    tables?: {
      text?: string;
    };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    example: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    purple: true;
  }
}