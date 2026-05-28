import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { IMercado } from '../../database/models';

export const getAll = async (
  page = 1,
  limit = 10,
  filter = ''
): Promise<IMercado[] | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .select('*')
      .where('nome_mercado', 'like', `%${filter}%`)
      .where('ativo', true)
      .limit(limit)
      .offset((page - 1) * limit);

    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar mercados');
  }
};