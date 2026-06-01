import * as login from './Login';
import * as getMe from './GetMe';
import * as forgotPassword from './ForgotPassword';
import * as resetPassword from './ResetPassword';

export const AuthController = {
  ...login,
  ...getMe,
  ...forgotPassword,
  ...resetPassword,
};