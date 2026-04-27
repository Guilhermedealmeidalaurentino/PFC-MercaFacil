import * as login from './GetByEmail'
import * as create from './Create'
export const AuthProvider = {
  ...login,
  ...create
};