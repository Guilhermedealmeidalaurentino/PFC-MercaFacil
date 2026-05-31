import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export const up = async (knex: Knex) => {
  await knex.schema.alterTable(ETablesNames.log_admin, (table) => {
    table.string('nome_admin').nullable();
    table.string('email_admin').nullable();
    table.string('mercado_admin').nullable();
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.alterTable(ETablesNames.log_admin, (table) => {
    table.dropColumn('nome_admin');
    table.dropColumn('email_admin');
    table.dropColumn('mercado_admin');
  });
};