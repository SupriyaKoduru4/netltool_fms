// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import App from "./App";

import { BrowserRouter } from "react-router-dom";

// @ts-ignore
import "./index.css";
import { store } from "../store";
import { AppProvider } from "./context/AppDate";
import {Toaster} from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  // <React.StrictMode>
      <BrowserRouter>
    <AppProvider>
    <StoreProvider store={store}>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
    </StoreProvider>
    </AppProvider>
      </BrowserRouter>
  // </React.StrictMode>
);