import * as deleteById from './DeleteById';
import * as updateProfile from './UpdateProfile';
import * as getById from './GetById';
import * as getAll from './GetAll';
import * as resetPassword from './ResetPassword'

export const UsuariosProvider = {
  ...deleteById,
  ...updateProfile,
  ...getById,
  ...getAll,
  ...resetPassword,
};