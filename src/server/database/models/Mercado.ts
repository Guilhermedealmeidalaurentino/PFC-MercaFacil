export interface IMercado {
  id: number;
  usuario_id: number;
  nome_mercado: string;
  cnpj: string;
  cep: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  descricao?: string;
  ativo: boolean;
  horario_abertura: string;
  horario_fechamento: string;
}