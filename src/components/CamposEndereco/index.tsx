import type {
  CamposEnderecoProps,
  EnderecoCooperativa,
} from "../../types/cooperativa";

interface DefinicaoCampo {
  nome: keyof EnderecoCooperativa;
  titulo: string;
  maximo: number;
}

const campos: readonly DefinicaoCampo[] = [
  { nome: "cep", titulo: "CEP", maximo: 9 },
  { nome: "uf", titulo: "UF", maximo: 2 },
  { nome: "cidade", titulo: "Cidade", maximo: 80 },
  { nome: "bairro", titulo: "Bairro", maximo: 80 },
  { nome: "logradouro", titulo: "Logradouro", maximo: 120 },
  { nome: "numero", titulo: "Número", maximo: 20 },
  { nome: "complemento", titulo: "Complemento", maximo: 100 },
];

export default function CamposEndereco({
  prefixo,
  endereco,
  erros,
  onChange,
}: CamposEnderecoProps) {
  return (
    <div className="formulario-grade">
      {campos.map((campo) => {
        const chave = `${prefixo}.${campo.nome}`;

        return (
          <div className="campo" key={campo.nome}>
            <label htmlFor={chave}>{campo.titulo}</label>

            <input
              id={chave}
              type="text"
              maxLength={campo.maximo}
              required={campo.nome !== "complemento"}
              value={endereco[campo.nome]}
              onChange={(evento) =>
                onChange({
                  ...endereco,
                  [campo.nome]: evento.target.value,
                })
              }
            />

            {erros[chave] && (
              <span className="erro-campo" role="alert">
                {erros[chave]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}