import * as login from './Login';
import * as create from './Create';

export const AuthController = {
  ...login,
  ...create
};