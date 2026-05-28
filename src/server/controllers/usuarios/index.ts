import * as signUpCliente from './SignUpCliente';
import * as signUpComerciante from './SignUpComerciante';
import * as signUpAdmin from './SignUpAdmin';
import * as updateProfile from './UpdateProfile';
import * as resetPassword from './ResetPassword';
import * as getById from './GetById';
import * as getAll from './GetAll';
import * as deleteById from './DeleteById';

export const UsuariosController = {
  ...signUpCliente,
  ...signUpComerciante,
  ...signUpAdmin,
  ...updateProfile,
  ...resetPassword,
  ...getById,
  ...getAll,
  ...deleteById,
};