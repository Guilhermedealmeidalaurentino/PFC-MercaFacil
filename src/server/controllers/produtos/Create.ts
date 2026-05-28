import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ProdutosProvider } from '../../database/providers/produtos';
import { MercadosProvider } from '../../database/providers/mercados';

interface IBodyProps {
  nome: string;
  descricao: string;
  categoria: string;
  marca: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
      descricao: yup.string().required().min(3),
      categoria: yup.string().required().min(3),
      marca: yup.string().required().min(2),
      preco: yup.number().required().min(0),
      estoque: yup.number().required().min(0),
      ativo: yup.boolean().default(true),
    })
  ),
}));

export const create = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'MERCADO') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Apenas comerciantes podem cadastrar produtos' },
    });
  }
  const mercado = await MercadosProvider.getById(req.userId);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const result = await ProdutosProvider.create({
    ...req.body,
    mercado_id: mercado.id,
  });

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.CREATED).json({ id: result });
};