import { knex } from 'knex';
import pg from 'pg';
import { development, production, test } from './Environment';

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production': return production;
    case 'test':       return test;
    default:           return development;
  }
};

if (process.env.NODE_ENV === 'production') {
  pg.types.setTypeParser(20, 'text', parseInt);
}

export const Knex = knex(getEnvironment());