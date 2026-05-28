import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';

export const updateProfile = async (
  id: number,
  usuario: Partial<
    Omit<
      IUsuario,
      'id'
      | 'senha'
      | 'role'
      | 'ativo'
    >
  >
): Promise<void | Error> => {
  try {
    const result = await Knex(
      ETablesNames.usuario
    )
      .update(usuario)
      .where('id', '=', id);

    if (result > 0) return;
    return new Error(
      'Erro ao atualizar perfil'
    );

  } catch (error) {

    console.log(error);

    return new Error(
      'Erro ao atualizar perfil'
    );
  }
};