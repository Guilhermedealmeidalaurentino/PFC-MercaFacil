import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';


export const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.usuario)
      .where('id', id)
      .delete();

    if (result > 0) return;
    return new Error('Erro ao deletar usuário');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao deletar usuário');
  }
};

export const deleteByIdAdmin = async (id: number): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.usuario)
      .where('id', id)
      .delete();

    if (result > 0) return;
    return new Error('Usuário não encontrado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao deletar usuário');
  }
};