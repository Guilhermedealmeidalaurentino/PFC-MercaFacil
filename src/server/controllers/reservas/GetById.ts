import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ReservasProvider } from '../../database/providers/reservas';
import { MercadosProvider } from '../../database/providers/mercados';

interface IParamProps {
  id?: number;
}

export const getReservaByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const getReservaById = async (
  req: Request<IParamProps>,
  res: Response
) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  // Para MERCADO, precisamos do mercado_id real, não o usuario_id
  let user_id = req.userId;
  if (req.userRole === 'MERCADO') {
    const mercado = await MercadosProvider.getById(req.userId);
    if (mercado instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Mercado não encontrado' },
      });
    }
    user_id = mercado.id;
  }

  const result = await ReservasProvider.getById(
    req.params.id,
    user_id,
    req.userRole as 'CLIENTE' | 'MERCADO' | 'ADMIN'
  );

  if (result instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};