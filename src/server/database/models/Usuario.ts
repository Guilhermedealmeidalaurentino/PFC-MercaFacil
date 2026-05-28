export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  role: 'ADMIN' | 'CLIENTE' | 'MERCADO';
  ativo: boolean;
}