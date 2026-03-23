// src/theme.js
import { createTheme } from "@mui/material/styles";

// Colors
const primaryColor = "#1E88E5"; // Blue
const secondaryColor = "#FFC107"; // Amber
const backgroundColor = "#F5F5F5"; // Light Grey
const cardBackground = "#FFFFFF"; // White

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: backgroundColor,
      paper: cardBackground,
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.16)",
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryColor}, #1565C0)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;