import type {
  CadastroCooperativa,
  Cooperativa,
  EnderecoCooperativa,
  Material,
} from "../types/cooperativa";

export const materiaisDisponiveis: readonly Material[] = [
  "PAPEL",
  "PLASTICO",
  "METAL",
  "VIDRO",
  "ELETRONICOS",
  "ORGANICOS",
];

export const nomesMateriais: Record<Material, string> = {
  PAPEL: "Papel",
  PLASTICO: "Plástico",
  METAL: "Metal",
  VIDRO: "Vidro",
  ELETRONICOS: "Eletrônicos",
  ORGANICOS: "Orgânicos",
};

export function enderecoVazio(): EnderecoCooperativa {
  return {
    cep: "",
    uf: "SP",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  };
}

export function cooperativaVazia(): CadastroCooperativa {
  return {
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    usuarioId: "",
    endereco: enderecoVazio(),
    materiais: [],
    pontos: [],
    status: "ATIVO",
  };
}

export const cooperativasSimuladas: readonly Cooperativa[] = [
  {
    id: "cooperativa-001",
    nome: "Cooperativa Recicla Mais",
    cnpj: "11222333000181",
    email: "contato@reciclamais.org",
    telefone: "1142229090",
    usuarioId: "usuario-005",
    criadoEm: "2026-06-04T12:00:00.000Z",
    status: "ATIVO",
    endereco: {
      cep: "06420000",
      uf: "SP",
      cidade: "Barueri",
      bairro: "Jardim Belval",
      logradouro: "Rua das Flores",
      numero: "250",
      complemento: "",
    },
    materiais: ["PAPEL", "PLASTICO", "METAL", "VIDRO"],
    pontos: [
      {
        id: "ponto-001",
        nome: "Galpão Central",
        abertura: "08:00",
        fechamento: "17:00",
        status: "ATIVO",
        materiais: ["PAPEL", "PLASTICO", "METAL", "VIDRO"],
        endereco: {
          cep: "06420000",
          uf: "SP",
          cidade: "Barueri",
          bairro: "Jardim Belval",
          logradouro: "Rua das Flores",
          numero: "250",
          complemento: "",
        },
      },
    ],
  },
];