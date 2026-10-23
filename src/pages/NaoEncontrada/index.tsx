import { Link } from "react-router-dom";

export default function NaoEncontrada() {
  return (
    <section className="pagina-erro">
      <p className="pagina-erro__codigo">404</p>

      <h1>Página não encontrada</h1>

      <p>O endereço acessado não corresponde a uma página do painel.</p>

      <Link className="botao botao--primario" to="/usuarios">
        Voltar para usuários
      </Link>
    </section>
  );
}