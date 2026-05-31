import * as getAll from './GetAll';
import * as getById from './GetById';
import * as updateById from './UpdateById';
import * as deleteById from './DeleteById';
import * as getAllAdmin from './GetAllAdmin';
import * as toggleAtivoMercado from './ToggleAtivoMercado';
import * as deleteByIdAdmin from './DeleteByIdAdmin';

export const MercadosController = {
  ...getAllAdmin,
  ...getAll,
  ...getById,
  ...updateById,
  ...deleteById,
  ...toggleAtivoMercado,
  ...deleteByIdAdmin,
};