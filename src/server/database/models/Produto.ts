export interface IProduto{
  id?: number;
  mercado_id: number;
  nome: string;
  descricao: string;
  categoria: string;
  marca: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}