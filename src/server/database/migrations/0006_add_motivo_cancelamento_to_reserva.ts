import type { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema.alterTable('reserva', (table) => {
    table.string('motivo_cancelamento').nullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.alterTable('reserva', (table) => {
    table.dropColumn('motivo_cancelamento');
  });
}