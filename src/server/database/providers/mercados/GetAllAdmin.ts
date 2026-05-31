import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IMercado } from '../../models';

export const getAllAdmin = async (
  page = 1,
  limit = 100,
  filter = ''
): Promise<(IMercado & { nome_comerciante: string; email_comerciante: string })[] | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .select(
        `${ETablesNames.mercado}.*`,
        `${ETablesNames.usuario}.nome as nome_comerciante`,
        `${ETablesNames.usuario}.email as email_comerciante`,
      )
      .join(ETablesNames.usuario, `${ETablesNames.usuario}.id`, `${ETablesNames.mercado}.usuario_id`)
      .where((builder) => {
        if (filter) {
          builder
            .where(`${ETablesNames.mercado}.nome_mercado`, 'like', `%${filter}%`)
            .orWhere(`${ETablesNames.usuario}.nome`, 'like', `%${filter}%`);
        }
      })
      .orderBy(`${ETablesNames.mercado}.id`, 'desc')
      .limit(limit)
      .offset((page - 1) * limit);
    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar mercados');
  }
};