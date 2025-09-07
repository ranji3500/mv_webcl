// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./global.css"; // Import Global CSS
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import theme from "./mui/theme/theme.ts";
// import { SnackbarProvider } from "./contexts/SnackbarContext.tsx";
// import { LoaderProvider } from "./contexts/LoaderContext.tsx";
// import { AuthProvider } from "./contexts/AuthContext.tsx";
// import "./utils/axiosInstance";

// createRoot(document.getElementById("root")!).render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <LoaderProvider>
//         <SnackbarProvider>
//           <App />
//         </SnackbarProvider>
//       </LoaderProvider>
//     </AuthProvider>
//   </ThemeProvider>
// );


import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./mui/theme/theme.ts";
import { SnackbarProvider } from "./contexts/SnackbarContext.tsx";
import { LoaderProvider } from "./contexts/LoaderContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./utils/axiosInstance";

// ✅ Add this for react-pdf
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <LoaderProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </LoaderProvider>
    </AuthProvider>
  </ThemeProvider>
);
