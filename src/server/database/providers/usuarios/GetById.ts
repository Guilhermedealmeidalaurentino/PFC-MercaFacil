import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';

export const getById = async (
  id: number
): Promise<
  Omit<IUsuario, 'senha'>
  | Error
> => {
  try {
    const result = await Knex(
      ETablesNames.usuario
    )
      .select([
        'id',
        'nome',
        'email',
        'cpf',
        'telefone',
        'role',
        'ativo',
        'aguardando_exclusao', 
      ])
      .where('id', '=', id)
      .first();
    if (result) return result;
    return new Error(
      'Usuário não encontrado'
    );
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao buscar usuário'
    );
  }
};