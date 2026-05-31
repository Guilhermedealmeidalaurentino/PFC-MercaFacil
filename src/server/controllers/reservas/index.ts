import * as getAll from './GetByCliente';
import * as getById from './GetById';
import * as getByMercado from './GetByMercado';
import * as create from './Create';
import * as updateStatus from './UpdateStatus';
import * as cancelarReserva from './CancelarReserva';
import * as getAllAdmin from './GetAllAdmin'; 
 
export const ReservasController = {
  ...getAll,
  ...getById,
  ...getByMercado,
  ...create,
  ...updateStatus,
  ...cancelarReserva,
  ...getAllAdmin,
};
 