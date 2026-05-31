import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export const up = async (knex: Knex) => {
  return knex.schema.createTable(ETablesNames.log_admin, (table) => {
    table.increments('id').primary();
    table.integer('admin_id')
      .notNullable()
      .references('id')
      .inTable(ETablesNames.usuario)
      .onDelete('CASCADE');
    table.string('acao').notNullable();
    table.timestamps(true, true);
  }).then(() => {
    console.log(`# Created table ${ETablesNames.log_admin}`);
  });
};

export const down = async (knex: Knex) => {
  return knex.schema.dropTable(ETablesNames.log_admin).then(() => {
    console.log(`# Dropped table ${ETablesNames.log_admin}`);
  });
};