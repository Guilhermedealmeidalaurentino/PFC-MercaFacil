import type { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";


export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable(ETablesNames.produto, table =>{
      table.bigIncrements('id').primary().index();
      table.string('nome',150).checkLength('<=',150).index().notNullable();
      table.double('preco',4).index().notNullable();
      table.double('estoque',6).index().notNullable();
    }).then(()=>{
        console.log(`# Created table ${ETablesNames.produto}`); 
    })

}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETablesNames.produto)
  .then(()=>{
        console.log(`# Dropped table ${ETablesNames.produto}`); 
    })


}


