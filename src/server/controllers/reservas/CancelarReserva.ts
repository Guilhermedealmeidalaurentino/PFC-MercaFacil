import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ReservasProvider } from '../../database/providers/reservas';

interface IParamProps {
  id?: number;
}

export const cancelarReservaValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const cancelarReserva = async (
  req: Request<IParamProps>,
  res: Response
) => {
  if (req.userRole !== 'CLIENTE') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Apenas clientes podem cancelar reservas' },
    });
  }

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  const result = await ReservasProvider.cancelarByCliente(
    req.params.id,
    req.userId
  );

  if (result instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};