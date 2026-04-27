import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { ProdutosProvider } from '../../database/providers/produtos';
import { validation } from '../../shared/middleware';
import { IProduto } from '../../database/models';


interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IProduto, 'id'> { }

export const updateByIdValidation = validation(getSchema => ({
  body: getSchema(
  yup.object().shape({
    nome: yup.string().min(3).max(150),

    descricao: yup.string().min(5).max(500),

    categoria: yup.string().min(3).max(100),

    marca: yup.string().min(2).max(100),

    preco: yup.number().moreThan(0),

    estoque: yup.number().integer().min(0),

    ativo: yup.boolean(),
    
  })),
  params: getSchema<IParamProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0),
  })),
}));

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.'
      }
    });
  }

  const result = await ProdutosProvider.updateById(req.params.id, req.body);
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).json(result);
};