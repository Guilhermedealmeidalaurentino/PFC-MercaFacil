import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('usuario', (table) => {
    table.boolean('aguardando_exclusao').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('aguardando_exclusao');
  });
}