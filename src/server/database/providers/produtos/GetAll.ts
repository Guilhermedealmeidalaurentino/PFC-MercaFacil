import { ETablesNames } from '../../ETablesNames';
import { IProduto } from '../../models';
import { Knex } from '../../knex';

export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  mercado_id = 0  
): Promise<IProduto[] | Error> => {
  try {
    const query = Knex(ETablesNames.produto)
      .select('*')
      .where('nome', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit);

    if (mercado_id > 0) {
      query.where('mercado_id', mercado_id); 
    }

    return await query;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar os registros');
  }
};