import * as signUpCliente from './SignUpCliente';
import * as signUpComerciante from './SignUpComerciante';
import * as signUpAdmin from './SignUpAdmin';
import * as updateProfile from './UpdateProfile';
import * as updateProfileAdmin from './UpdateProfileAdmin'; // ← novo
import * as resetPassword from './ResetPassword';
import * as getById from './GetById';
import * as getAll from './GetAll';
import * as deleteById from './DeleteById';
import * as toggleAtivo from './ToggleAtivo';
import * as getAllAdmin from './GetAllAdmin';

export const UsuariosController = {
  ...signUpCliente,
  ...signUpComerciante,
  ...signUpAdmin,
  ...updateProfile,
  ...updateProfileAdmin, // ← novo
  ...resetPassword,
  ...getById,
  ...getAll,
  ...deleteById,
  ...toggleAtivo,
  ...getAllAdmin,
};