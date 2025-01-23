"use client";
import { createTheme, ThemeProvider as ThemeProviderLib } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2B26AB",
      light: "#3758F9",
    },
    error: {
      main: "#FF5050",
    },
  },
});

export default function ThemeProvider({ children }) {
  return <ThemeProviderLib theme={theme}>{children}</ThemeProviderLib>;
}
