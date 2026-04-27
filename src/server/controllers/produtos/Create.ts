import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middleware';
import { IProduto } from '../../database/models';
import { ProdutosProvider } from '../../database/providers/produtos';


interface IBodyProps extends Omit<IProduto, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup
        .string()
        .required()
        .min(3)
        .max(150),

      descricao: yup
        .string()
        .required()
        .min(5)
        .max(500),

      categoria: yup
        .string()
        .required()
        .min(3)
        .max(100),

      marca: yup
        .string()
        .required()
        .min(2)
        .max(100),

      preco: yup
        .number()
        .required()
        .moreThan(0),

      estoque: yup
        .number()
        .required()
        .integer()
        .min(0),

      ativo: yup
        .boolean()
        .optional()
        .default(true),
    })
  ),
}));

export const create = async (req: Request<{}, {}, IProduto>, res: Response) => {
  const result = await ProdutosProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};