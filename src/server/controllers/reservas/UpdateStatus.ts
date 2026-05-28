import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ReservasProvider } from '../../database/providers/reservas';
import { MercadosProvider } from '../../database/providers/mercados';
import { IReserva } from '../../database/models';

interface IParamProps {
  id?: number;
}

interface IBodyProps {
  status: IReserva['status'];
}

export const updateStatusValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
  body: getSchema<IBodyProps>(
  yup.object().shape({
    status: yup
      .mixed<IReserva['status']>()
      .required()
      .oneOf(['CONFIRMADA', 'RETIRADA', 'CANCELADA']),
  })
),
}));

export const updateStatus = async (
  req: Request<IParamProps, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'MERCADO') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  const mercado = await MercadosProvider.getById(req.userId);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const result = await ReservasProvider.updateStatus(
    req.params.id,
    mercado.id,
    req.body.status
  );

  if (result instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};