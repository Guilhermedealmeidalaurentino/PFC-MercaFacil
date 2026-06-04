import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ReservasProvider } from '../../database/providers/reservas';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { IReserva } from '../../database/models';
import { AuthProvider } from '../../database/providers/auth';

interface IParamProps {
  id?: number;
}

interface IBodyProps {
  status: IReserva['status'];
  motivo_cancelamento?: string;
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMADA: 'Confirmou',
  RETIRADA: 'Marcou como Retirada',
  CANCELADA: 'Cancelou',
};

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
      motivo_cancelamento: yup.string().optional(),
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

  const mercado = await MercadosProvider.getByUsuarioId(req.userId);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const result = await ReservasProvider.updateStatus(
    req.params.id,
    mercado.id,
    req.body.status,
    req.body.motivo_cancelamento,
  );

  if (result instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: result.message },
    });
  }

  const verbo = STATUS_LABEL[req.body.status] ?? 'Atualizou';
  const extra = req.body.motivo_cancelamento ? ` — motivo: "${req.body.motivo_cancelamento}"` : '';

  const comerciante = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `[RESERVA] ${verbo} a reserva #${req.params.id} (mercado: "${mercado.nome_mercado}")${extra}`,
    comerciante instanceof Error ? '' : comerciante.nome,
    comerciante instanceof Error ? '' : comerciante.email,
    mercado.nome_mercado,
  );
  if (result.contaExcluida) {
  return res.status(StatusCodes.OK).json({ contaExcluida: true });
}

return res.status(StatusCodes.NO_CONTENT).send();
};