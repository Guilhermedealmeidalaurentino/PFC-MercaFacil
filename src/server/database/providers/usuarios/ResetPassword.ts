import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { PasswordCrypto } from '../../../shared/services';

export const resetPassword = async (
  id: number,
  novaSenha: string
): Promise<void | Error> => {
  try {
    const hashedPassword =
      await PasswordCrypto.hashPassword(
        novaSenha
      );
    const result = await Knex(
      ETablesNames.usuario
    )
      .update({
        senha: hashedPassword,
      })
      .where('id', '=', id);
    if (result > 0) return;
    return new Error(
      'Erro ao redefinir senha'
    );
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao redefinir senha'
    );
  }
};