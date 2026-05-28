import * as signUpCliente from './SignUpCliente';
import * as signUpComerciante from './SignUpComerciante'; // ← corrigido
import * as resetPassword from './ResetPassword';
import * as deleteById from './DeleteById';
import * as getAll from './GetAll';
import * as signUpAdmin from './SignUpAdmin';

export const UsuariosController = {
  ...signUpCliente,
  ...signUpComerciante,
  ...signUpAdmin,
  ...resetPassword,
  ...deleteById,
  ...getAll,
};