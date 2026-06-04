import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';
import { Knex } from '../../knex';

export const getByEmail = async (
  email: string
): Promise<IUsuario | Error> => {
  try {
    const result = await Knex(ETablesNames.usuario)
      .select([
        'id',
        'nome',
        'email',
        'senha',
        'role',
        'ativo',
        'aguardando_exclusao',  // ← adicionar essa linha
      ])
      .where('email', '=', email)
      .first();
    if (!result) {
      return new Error('Usuário não encontrado');
    }
    return result;
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao consultar o registro'
    );
  }
};