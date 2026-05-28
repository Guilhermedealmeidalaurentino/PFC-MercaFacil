import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IMercado } from '../../models';

export const getByUsuarioId = async (
  usuario_id: number
): Promise<IMercado | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .where('usuario_id', '=', usuario_id)
      .first();

    if (result) return result;
    return new Error('Mercado não encontrado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar mercado');
  }
};