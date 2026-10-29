import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import AuthProvider from "./components/AuthProvider";
import AcessibilidadeProvider from "./components/AcessibilidadeProvider";

import "../styles/global.css";
import "../styles/acessibilidade.css";

const elementoRaiz = document.getElementById("root");

if (!elementoRaiz) {
  throw new Error("Não foi encontrado o elemento #root no HTML.");
}

createRoot(elementoRaiz).render(
  <StrictMode>
    <BrowserRouter>
      <AcessibilidadeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AcessibilidadeProvider>
    </BrowserRouter>
  </StrictMode>,
);