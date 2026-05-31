// src/server/database/migrations/0009_fix_log_admin_fk.ts
import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export const up = async (knex: Knex) => {
  await knex.schema.alterTable(ETablesNames.log_admin, (table) => {
    table.dropForeign(['admin_id']);
    table.integer('admin_id').nullable().alter();
    table.foreign('admin_id')
      .references('id')
      .inTable(ETablesNames.usuario)
      .onDelete('SET NULL');
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.alterTable(ETablesNames.log_admin, (table) => {
    table.dropForeign(['admin_id']);
    table.integer('admin_id').notNullable().alter();
    table.foreign('admin_id')
      .references('id')
      .inTable(ETablesNames.usuario)
      .onDelete('CASCADE');
  });
};