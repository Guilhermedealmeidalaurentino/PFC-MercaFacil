import * as create from './Create';
import * as getByCliente from './GetByCliente';
import * as getByMercado from './GetByMercado';
import * as getById from './GetById';
import * as updateStatus from './UpdateStatus';
import * as cancelarReserva from './CancelarReserva';

export const ReservasController = {
  ...create,
  ...getByCliente,
  ...getByMercado,
  ...getById,
  ...updateStatus,
  ...cancelarReserva,
};