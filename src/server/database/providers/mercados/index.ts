import * as deleteById from './DeleteById';
import * as updateById from './UpdateById';
import * as getById from './GetById';
import * as getByUsuarioId from './GetByUsuarioId';
import * as create from './Create';
import * as getAll from './GetAll';

export const MercadosProvider = {
  ...deleteById,
  ...updateById,
  ...getById,
  ...getByUsuarioId,
  ...create,
  ...getAll,
};