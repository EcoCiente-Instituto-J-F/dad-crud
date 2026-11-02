import type {
AlterarSenhaApi,
AtualizarPerfilApi,
} from "./perfilApi";
import type { UsuarioApi } from "./usuarioApi";

export interface FormularioProps {
  usuario: UsuarioApi;
  salvando: boolean;
  mensagem: string;
  salvarPerfil: (dados: AtualizarPerfilApi) => Promise<void>;
  salvarSenha: (dados: AlterarSenhaApi) => Promise<void>;
}
