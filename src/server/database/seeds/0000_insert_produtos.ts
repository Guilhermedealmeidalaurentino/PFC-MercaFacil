import knex, { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";

export const seed = async (knex: Knex) =>{
  const [{count}] = await knex(ETablesNames.produto).count<[{count: number}]>('* as count');
  if(!Number.isInteger(count) ||  Number(count)>0) return;

  const produtoToInsert = produtosDeMercado;
  await knex(ETablesNames.produto).insert(produtoToInsert);
};


const produtosDeMercado = [

  { nome: "Arroz Branco 5kg", descricao: "Arroz tipo 1", categoria: "Grãos", marca: "Tio João", preco: 24.9, estoque: 50, ativo: true },
  { nome: "Feijão Carioca 1kg", descricao: "Feijão tipo carioca", categoria: "Grãos", marca: "Camil", preco: 7.5, estoque: 80, ativo: true },
  { nome: "Macarrão Espaguete 500g", descricao: "Macarrão de trigo", categoria: "Massas", marca: "Barilla", preco: 6.3, estoque: 60, ativo: true },
  { nome: "Óleo de Soja 900ml", descricao: "Óleo vegetal refinado", categoria: "Óleos", marca: "Liza", preco: 8.9, estoque: 70, ativo: true },
  { nome: "Açúcar Refinado 1kg", descricao: "Açúcar branco refinado", categoria: "Grãos", marca: "União", preco: 4.2, estoque: 90, ativo: true },
  { nome: "Sal Refinado 1kg", descricao: "Sal iodado", categoria: "Grãos", marca: "Cisne", preco: 2.5, estoque: 100, ativo: true },
  { nome: "Leite Integral 1L", descricao: "Leite longa vida", categoria: "Laticínios", marca: "Piracanjuba", preco: 4.8, estoque: 120, ativo: true },
  { nome: "Manteiga 200g", descricao: "Manteiga com sal", categoria: "Laticínios", marca: "Aviação", preco: 9.9, estoque: 40, ativo: true },
  { nome: "Queijo Mussarela 500g", descricao: "Queijo fatiado", categoria: "Laticínios", marca: "Itambé", preco: 18.5, estoque: 35, ativo: true },
  { nome: "Presunto 200g", descricao: "Presunto fatiado", categoria: "Frios", marca: "Sadia", preco: 7.9, estoque: 45, ativo: true },

  { nome: "Refrigerante Cola 2L", descricao: "Bebida gaseificada", categoria: "Bebidas", marca: "Coca-Cola", preco: 9.0, estoque: 80, ativo: true },
  { nome: "Refrigerante Guaraná 2L", descricao: "Bebida sabor guaraná", categoria: "Bebidas", marca: "Antarctica", preco: 8.5, estoque: 70, ativo: true },
  { nome: "Suco de Laranja 1L", descricao: "Suco integral", categoria: "Bebidas", marca: "Del Valle", preco: 6.9, estoque: 60, ativo: true },
  { nome: "Água Mineral 1.5L", descricao: "Água sem gás", categoria: "Bebidas", marca: "Crystal", preco: 3.0, estoque: 100, ativo: true },
  { nome: "Café Torrado 500g", descricao: "Café moído", categoria: "Grãos", marca: "Pilão", preco: 14.0, estoque: 55, ativo: true },

  { nome: "Biscoito Recheado Chocolate", descricao: "Biscoito doce", categoria: "Biscoitos", marca: "Oreo", preco: 4.5, estoque: 75, ativo: true },
  { nome: "Biscoito Salgado 200g", descricao: "Snack salgado", categoria: "Biscoitos", marca: "Club Social", preco: 3.8, estoque: 65, ativo: true },
  { nome: "Chocolate ao Leite 90g", descricao: "Chocolate barra", categoria: "Doces", marca: "Nestlé", preco: 5.5, estoque: 50, ativo: true },
  { nome: "Achocolatado 400g", descricao: "Mistura para leite", categoria: "Doces", marca: "Nescau", preco: 7.2, estoque: 40, ativo: true },
  { nome: "Leite Condensado", descricao: "Leite condensado", categoria: "Doces", marca: "Moça", preco: 6.5, estoque: 45, ativo: true },

  { nome: "Sabão em Pó 1kg", descricao: "Lavagem de roupas", categoria: "Limpeza", marca: "OMO", preco: 12.0, estoque: 50, ativo: true },
  { nome: "Detergente Líquido", descricao: "Limpeza de louças", categoria: "Limpeza", marca: "Ypê", preco: 2.8, estoque: 90, ativo: true },
  { nome: "Desinfetante 1L", descricao: "Limpeza geral", categoria: "Limpeza", marca: "Veja", preco: 6.0, estoque: 60, ativo: true },
  { nome: "Esponja de Louça", descricao: "Esponja multiuso", categoria: "Limpeza", marca: "Scotch-Brite", preco: 2.5, estoque: 100, ativo: true },
  { nome: "Papel Higiênico 12un", descricao: "Folha dupla", categoria: "Higiene", marca: "Neve", preco: 18.0, estoque: 40, ativo: true },

  { nome: "Shampoo 350ml", descricao: "Cabelos normais", categoria: "Higiene", marca: "Pantene", preco: 14.0, estoque: 35, ativo: true },
  { nome: "Condicionador 350ml", descricao: "Cabelos macios", categoria: "Higiene", marca: "Pantene", preco: 14.0, estoque: 35, ativo: true },
  { nome: "Sabonete 90g", descricao: "Uso diário", categoria: "Higiene", marca: "Dove", preco: 3.5, estoque: 80, ativo: true },
  { nome: "Creme Dental", descricao: "Proteção dental", categoria: "Higiene", marca: "Colgate", preco: 4.0, estoque: 70, ativo: true },
  { nome: "Escova de Dente", descricao: "Cerdas macias", categoria: "Higiene", marca: "Oral-B", preco: 6.0, estoque: 60, ativo: true },


]