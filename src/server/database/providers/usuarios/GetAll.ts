import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';

export const getAll = async (
  page = 1,
  limit = 10,
  filter = ''
): Promise<Omit<IUsuario, 'senha'>[] | Error> => {
  try {
    const result = await Knex(
      ETablesNames.usuario
    )
      .select([
        'id',
        'nome',
        'email',
        'telefone',
        'role',
        'ativo',
      ])
      .where((builder) => {
        if (filter) {
          builder
            .where('nome', 'like', `%${filter}%`)
            .orWhere('email', 'like', `%${filter}%`);
        }
      })
      .andWhere('ativo', '=', true)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('id', 'desc');
    return result;
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao listar usuários'
    );
  }
};