import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';

export const LogsProvider = {

  registrar: async (
  admin_id: number,
  acao: string,
  nome_admin: string,
  email_admin: string,
  mercado_admin?: string | null,
): Promise<void | Error> => {
  try {
    await Knex(ETablesNames.log_admin).insert({
      admin_id,
      acao,
      nome_admin,
      email_admin,
      mercado_admin: mercado_admin ?? null,
    });
  } catch (error) {
    console.log(error);
    return new Error('Erro ao registrar log');
  }
},

getAll: async (): Promise<any[] | Error> => {
  try {
    const result = await Knex(ETablesNames.log_admin)
      .select(
        `${ETablesNames.log_admin}.*`,
        `${ETablesNames.usuario}.role as role_admin`,
      )
      .leftJoin(
        ETablesNames.usuario,
        `${ETablesNames.usuario}.id`,
        `${ETablesNames.log_admin}.admin_id`,
      )
      .orderBy(`${ETablesNames.log_admin}.created_at`, 'desc');

    return result;
  } catch (error) {
    console.error('ERRO AO REGISTRAR LOG:', error);
    return new Error('Erro ao registrar log');
  }
},
};