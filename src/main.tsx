import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { RootStoreContext } from "./store/useStore";
import rootStore from "./store/RootStore";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// declare module "@mui/material/styles" {
//     interface Palette {
//         active: Palette["primary"];
//         neutral: Palette["primary"];
//     }

//     interface PaletteOptions {
//         active: PaletteOptions["primary"];
//         neutral: PaletteOptions["primary"];
//     }

//     interface PaletteColor {
//         darker?: string;
//       }

//       interface SimplePaletteColorOptions {
//         darker?: string;
//       }
// }

const theme = createTheme({
    palette: {
        primary: {
            main: "#e03997",
        },
        secondary: {
            main: "#b5bbc4",
        },
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RootStoreContext.Provider value={rootStore}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </RootStoreContext.Provider>
    </React.StrictMode>
);
