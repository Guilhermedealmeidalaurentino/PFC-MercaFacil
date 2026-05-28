import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { CNPJValidation, CPFValidation, EmailDomainValidation, PasswordCrypto, ViaCEPService } from '../../shared/services';
import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';

interface IBodyProps {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone?: string;
  cnpj: string;
  cep: string;
  nome_mercado: string;
}

const produtosBase = [
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
];

export const signUpComercianteValidation = validation(
  (getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({
        nome: yup.string().required().min(3),
        email: yup
          .string()
          .required()
          .email()
          .min(5)
          .test(
            'dominio-valido',
            'Use um e-mail de um provedor conhecido (gmail, hotmail, outlook...)',
            (value) => EmailDomainValidation(value ?? '')
          ),
        senha: yup.string().required().min(6),
        cpf: yup
          .string()
          .required()
          .test(
            'cpf-valido',
            'CPF inválido',
            (value) => CPFValidation(value ?? '')
          ),
        telefone: yup.string().optional(),
        cnpj: yup
          .string()
          .required()
          .min(14)
          .test(
            'cnpj-valido',
            'CNPJ inválido',
            (value) => CNPJValidation(value ?? '')
          ),
        cep: yup
          .string()
          .required()
          .min(8)
          .test(
            'cep-valido',
            'CEP inválido ou não encontrado',
            async (value) => {
              if (!value) return false;
              const result = await ViaCEPService.buscarCep(value);
              return !(result instanceof Error);
            }
          ),
        nome_mercado: yup.string().required().min(3),
      })
    ),
  })
);

export const signUpComerciante = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const { nome, email, senha, cpf, telefone, cnpj, cep, nome_mercado } = req.body;

  const dadosCep = await ViaCEPService.buscarCep(cep);
  if (dadosCep instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: dadosCep.message },
    });
  }

  try {
    const { usuario_id, mercado_id } = await Knex.transaction(async (trx) => {
      const usuarioExistente = await trx(ETablesNames.usuario)
        .where('email', email)
        .first();

      if (usuarioExistente) {
        throw new Error('Email já cadastrado');
      }

      const hashedPassword = await PasswordCrypto.hashPassword(senha);

      const [usuario] = await trx(ETablesNames.usuario)
        .insert({
          nome,
          email,
          senha: hashedPassword,
          cpf: cpf.replace(/\D/g, ''),
          telefone,
          role: 'MERCADO',
          ativo: true,
        })
        .returning('id');

      const [mercado] = await trx(ETablesNames.mercado)
        .insert({
          usuario_id: usuario.id,
          cnpj,
          cep,
          nome_mercado,
          ativo: true,
          logradouro: dadosCep.logradouro,
          bairro: dadosCep.bairro,
          cidade: dadosCep.localidade,
          estado: dadosCep.uf,
        })
        .returning('id');

      const produtos = produtosBase.map(produto => ({
        ...produto,
        mercado_id: mercado.id,
      }));

      await trx(ETablesNames.produto).insert(produtos);

      return { usuario_id: usuario.id, mercado_id: mercado.id };
    });

    return res.status(StatusCodes.CREATED).json({ usuario_id, mercado_id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao cadastrar comerciante';
    const status = message === 'Email já cadastrado'
      ? StatusCodes.CONFLICT
      : StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(status).json({
      errors: { default: message },
    });
  }
};