import * as login from './Login';
import * as getMe from './GetMe';

export const AuthController = {
  ...login,
  ...getMe

};