import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    auth?: string;
  }
  interface TypeText {
    label?: string;
  }
}
