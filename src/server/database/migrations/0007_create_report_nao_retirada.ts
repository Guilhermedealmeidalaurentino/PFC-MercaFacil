import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('report_nao_retirada', (table) => {
    table.increments('id').primary();
    table.integer('reserva_id').unsigned().notNullable()
      .references('id').inTable('reserva').onDelete('CASCADE');
    table.integer('mercado_id').unsigned().notNullable()
      .references('id').inTable('mercado').onDelete('CASCADE');
    table.integer('cliente_id').unsigned().notNullable()
      .references('id').inTable('usuario').onDelete('CASCADE');
    table.string('motivo').notNullable();
    table.boolean('visualizado').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('report_nao_retirada');
}