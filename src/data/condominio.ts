import type { Condominio } from "../types/condominio";

export const condominiosSimulados: readonly Condominio[] = [
  {
    id: "condominio-001",
    nome: "Condomínio Jardim Verde",
    cnpj: "11222333000181",
    tipo: "RESIDENCIAL",
    codigoAcesso: "JV-8K4P",
    sindicoId: "usuario-004",
    status: "ATIVO",
    moradores: 126,
    cep: "06454000",
    uf: "SP",
    cidade: "Barueri",
    bairro: "Alphaville",
    logradouro: "Alameda Rio Negro",
    numero: "1000",
    complemento: "",
    torres: [
      { id: "torre-001", nome: "Torre Ipê", moradores: 34 },
      { id: "torre-002", nome: "Torre Araucária", moradores: 31 },
      { id: "torre-003", nome: "Torre Cedro", moradores: 29 },
    ],
  },
];