import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.alterTable('usuario', (table) => {
    table.string('cpf', 14).nullable().unique();
  });
}

export async function down(knex: Knex) {
  return knex.schema.alterTable('usuario', (table) => {
    table.dropColumn('cpf');
  });
}