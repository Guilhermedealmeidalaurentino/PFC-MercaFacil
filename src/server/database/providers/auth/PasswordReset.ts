import { Knex } from '../../knex';
import crypto from 'crypto';

const createToken = async (usuario_id: number) => {
  // Invalida tokens anteriores do mesmo usuário
  await Knex('password_reset_tokens')
    .where({ usuario_id })
    .update({ used: true });

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await Knex('password_reset_tokens').insert({
    usuario_id,
    token,
    expires_at,
    used: false,
  });

  return token;
};

const findValidToken = async (token: string) => {
  const record = await Knex('password_reset_tokens')
    .where({ token, used: false })
    .where('expires_at', '>', new Date())
    .first();

  return record || null;
};

const markAsUsed = async (token: string) => {
  await Knex('password_reset_tokens').where({ token }).update({ used: true });
};

export const PasswordResetProvider = { createToken, findValidToken, markAsUsed };