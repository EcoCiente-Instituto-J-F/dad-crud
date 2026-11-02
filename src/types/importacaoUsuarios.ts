import type { CriarUsuarioApi } from "./usuarioApi";

export interface LinhaImportacao { linha: number; nome: string; email: string; dados: CriarUsuarioApi | null; erros: string[] }
export const colunasImportacao = ["nome", "email", "senha", "tipoUsuarioId", "cpf", "dataNascimento", "avatar", "cep", "uf", "cidade", "logradouro", "numero", "complemento", "condominioId"];
