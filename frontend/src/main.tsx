// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import App from "./App";

import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { store } from "../store";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
);