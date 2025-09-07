import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0090D4", // Custom primary color
    },
  },
  typography: {
    fontFamily: '"Cabin", sans-serif', // Apply Cabin font globally
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: "62.5%", // 1rem = 10px for easier rem calculations
        },
        body: {
          fontFamily: '"Cabin", sans-serif',
          lineHeight: "1",
          margin: 0,
          padding: 0,
          background: "#E5E8E7",
        },
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff2423",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.6rem",
          textTransform: "none",
          borderRadius: "0.8rem",
        },
        sizeLarge: {
          height: "5.6rem",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "0",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: "1.4rem",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: "1.2rem",
          width: "2.4rem",
          height: "2.4rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        scrollButtons: {
          "&.Mui-disabled": { opacity: 0.4 },
          "& svg": {
            width: 15,
            height: 15,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "1.4rem",
          boxShadow: "none",
          borderRadius: "1.6rem",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "0",
          marginBottom: "1rem",
        },
        title: {
          fontSize: "1.8rem",
          fontWeight: "700400",
          color: "#0e1010",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            fontSize: "1.6rem",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            fontSize: "1.6rem",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
