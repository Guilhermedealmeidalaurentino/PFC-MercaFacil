import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';

export const getAllAdmin = async (
  page = 1,
  limit = 10,
  filter = ''
): Promise<Omit<IUsuario, 'senha'>[] | Error> => {
  try {
    const result = await Knex(ETablesNames.usuario)
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
      .where((builder) => {
        if (filter) {
          builder
            .where('nome', 'like', `%${filter}%`)
            .orWhere('email', 'like', `%${filter}%`);
        }
      })
      // ← sem filtro de ativo
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy('id', 'desc');
    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao listar usuários');
  }
};