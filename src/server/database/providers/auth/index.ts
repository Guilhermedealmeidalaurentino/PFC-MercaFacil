import * as login from './GetByEmail'
import * as getById from './GetById'
import * as create from './Create'
export const AuthProvider = {
  ...login,
  ...create,
  ...getById,
};