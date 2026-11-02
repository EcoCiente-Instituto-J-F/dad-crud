import "./services/modoDemo";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import App from "./App";
import AuthProvider from "./components/AuthProvider";
import AcessibilidadeProvider from "./components/AcessibilidadeProvider";

import "../styles/global.css";
import "../styles/admin-referencia.css";
import "../styles/acessibilidade.css";

const elementoRaiz = document.getElementById("root");

if (!elementoRaiz) {
  throw new Error("Não foi encontrado o elemento #root no HTML.");
}

const Router = import.meta.env.MODE === "pages" ? HashRouter : BrowserRouter;

createRoot(elementoRaiz).render(
  <StrictMode>
    <Router>
      <AcessibilidadeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AcessibilidadeProvider>
    </Router>
  </StrictMode>,
);