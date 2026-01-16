import "@mui/material/styles";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface TypeBackground {
    auth?: string;
  }
  interface TypeText {
    label?: string;
  }
  interface Palette {
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