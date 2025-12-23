import "@mui/material/styles";

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
      bgActive: string;
      bgHover: string;
      bgActiveHover: string;
      indicator: string;
      section: string;
      divider: string;
      userNameColor: string;
      userEmailColor: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      text?: string;
      textActive?: string;
      bgActive?: string;
      bgHover?: string;
      bgActiveHover?: string;
      indicator?: string;
      section?: string;
      divider?: string;
      userNameColor?: string;
      userEmailColor?: string;
    };
  }
}
