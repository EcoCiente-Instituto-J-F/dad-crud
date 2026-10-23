import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

const Usuarios = lazy(() => import("./pages/Usuarios"));
const Modulo = lazy(() => import("./pages/Modulo"));
const NaoEncontrada = lazy(() => import("./pages/NaoEncontrada"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={<Navigate to="/usuarios" replace />}
        />

        <Route path="/usuarios" element={<Usuarios />} />

        <Route
          path="/condominios"
          element={
            <Modulo
              titulo="Condomínios"
              descricao="Visualize e gerencie os condomínios cadastrados"
            />
          }
        />

        <Route
          path="/cooperativas"
          element={
            <Modulo
              titulo="Cooperativas"
              descricao="Visualize e gerencie as cooperativas parceiras"
            />
          }
        />

        <Route
          path="/coletas"
          element={
            <Modulo
              titulo="Coletas"
              descricao="Acompanhe e organize os agendamentos de coleta"
            />
          }
        />

        <Route
          path="/cursos"
          element={
            <Modulo
              titulo="Cursos"
              descricao="Gerencie os cursos e as aulas do EcoCiente"
            />
          }
        />

        <Route
          path="/quizzes"
          element={
            <Modulo
              titulo="Quizzes"
              descricao="Gerencie os quizzes do conteúdo educativo"
            />
          }
        />

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}