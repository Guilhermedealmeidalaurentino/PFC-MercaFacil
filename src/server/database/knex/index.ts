require('dotenv').config();
import { knex } from 'knex';
import 'dotenv/config';
import pg from 'pg';

import { development, production, test } from './Environment';

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  pg.types.setTypeParser(20, 'text', parseInt);
}
console.log('ENV TESTE:', process.env.TESTE);
const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production': return production;
    case 'test': return test;

    default: return development;
  }
};

export const Knex = knex(getEnvironment());