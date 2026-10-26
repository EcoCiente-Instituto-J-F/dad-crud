import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Erro = lazy(() => import("./pages/Erro"));

const Usuarios = lazy(() => import("./pages/Usuarios"));
const UsuarioCadastrar = lazy(() => import("./pages/UsuarioCadastrar"));
const UsuarioDetalhes = lazy(() => import("./pages/UsuarioDetalhes"));
const UsuarioEditar = lazy(() => import("./pages/UsuarioEditar"));

const Condominios = lazy(() => import("./pages/Condominios"));
const CondominioFormulario = lazy(() => import("./pages/CondominioFormulario"));
const CondominioDetalhes = lazy(() => import("./pages/CondominioDetalhes"));

const Cooperativas = lazy(() => import("./pages/Cooperativas"));
const CooperativaFormulario = lazy(() => import("./pages/CooperativaFormulario"));
const CooperativaDetalhes = lazy(() => import("./pages/CooperativasDetalhes"));

const Cursos = lazy(() => import("./pages/Cursos"));
const CursoFormulario = lazy(() => import("./pages/CursoFormulario"));
const CursoDetalhes = lazy(() => import("./pages/CursoDetalhes"));

const Quizzes = lazy(() => import("./pages/Quizzes"));
const QuizFormulario = lazy(() => import("./pages/QuizFormulario"));

const Coletas = lazy(() => import("./pages/Coletas"));
const ColetaFormulario = lazy(() => import("./pages/ColetaFormulario"));
const ColetaDetalhes = lazy(() => import("./pages/ColetaDetalhes"));

export default function App() {
  return (
    <Suspense
      fallback={
        <p className="mensagem-carregamento" role="status">
          Carregando aplicação...
        </p>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />

            <Route path="/home" element={<Home />} />
            <Route path="/perfil" element={<Perfil />} />

            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/cadastrar" element={<UsuarioCadastrar />} />
            <Route path="/usuarios/:id" element={<UsuarioDetalhes />} />
            <Route path="/usuarios/:id/editar" element={<UsuarioEditar />} />

            <Route path="/condominios" element={<Condominios />} />
            <Route
              path="/condominios/cadastrar"
              element={<CondominioFormulario key="cadastro" modo="cadastro" />}
            />
            <Route path="/condominios/:id" element={<CondominioDetalhes />} />
            <Route
              path="/condominios/:id/editar"
              element={<CondominioFormulario key="edicao" modo="edicao" />}
            />

            <Route path="/cooperativas" element={<Cooperativas />} />
            <Route
              path="/cooperativas/cadastrar"
              element={<CooperativaFormulario key="cadastro" modo="cadastro" />}
            />
            <Route path="/cooperativas/:id" element={<CooperativaDetalhes />} />
            <Route
              path="/cooperativas/:id/editar"
              element={<CooperativaFormulario key="edicao" modo="edicao" />}
            />

            <Route path="/cursos" element={<Cursos />} />
            <Route
              path="/cursos/cadastrar"
              element={<CursoFormulario key="cadastro" modo="cadastro" />}
            />
            <Route path="/cursos/:id" element={<CursoDetalhes />} />
            <Route
              path="/cursos/:id/editar"
              element={<CursoFormulario key="edicao" modo="edicao" />}
            />

            <Route path="/quizzes" element={<Quizzes />} />
            <Route
              path="/quizzes/cadastrar"
              element={<QuizFormulario key="cadastro" modo="cadastro" />}
            />
            <Route
              path="/quizzes/:id/editar"
              element={<QuizFormulario key="edicao" modo="edicao" />}
            />

            <Route path="/coletas" element={<Coletas />} />
            <Route
              path="/coletas/cadastrar"
              element={<ColetaFormulario key="cadastro" modo="cadastro" />}
            />
            <Route path="/coletas/:id" element={<ColetaDetalhes />} />
            <Route
              path="/coletas/:id/editar"
              element={<ColetaFormulario key="edicao" modo="edicao" />}
            />

            <Route path="/403" element={<Erro codigo="403" />} />
            <Route path="/500" element={<Erro codigo="500" />} />
            <Route path="*" element={<Erro codigo="404" />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}