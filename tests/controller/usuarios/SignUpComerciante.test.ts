import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { server } from '../../../src/server/Server';
import { ViaCEPService } from '../../../src/server/shared/services';
import { LogsProvider } from '../../../src/server/database/providers/logs';

jest.mock('../../../src/server/shared/services/ViaCEPService');
jest.mock('../../../src/server/database/providers/logs');
jest.mock('../../../src/server/database/knex');

import { Knex } from '../../../src/server/database/knex';

const testServer = supertest(server);
const mockKnex = Knex as unknown as jest.Mock & {
  transaction: jest.Mock;
};

const dadosCepMock = {
  cep: '01310-100',
  logradouro: 'Avenida Paulista',
  bairro: 'Bela Vista',
  localidade: 'São Paulo',
  uf: 'SP',
};

describe('Usuarios - SignUp Comerciante', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (ViaCEPService.buscarCep as jest.Mock).mockResolvedValue(dadosCepMock);
    (LogsProvider.registrar as jest.Mock).mockResolvedValue(undefined);

    mockKnex.transaction = jest.fn().mockImplementation(async (cb: Function) => {
      const trx = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 1 }]),
      });
      return cb(trx);
    });
  });

  it('Cadastra comerciante com sucesso', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('usuario_id');
    expect(res.body).toHaveProperty('mercado_id');
  });

  it('Rejeita email inválido', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'email-invalido',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.email');
  });

  it('Rejeita CNPJ inválido', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '00.000.000/0000-00',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.cnpj');
  });

  it('Rejeita CPF inválido', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '000.000.000-00',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.cpf');
  });

  it('Rejeita senha muito curta', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.senha');
  });

  it('Rejeita nome muito curto', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'Jo',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.nome');
  });

  it('Rejeita nome do mercado muito curto', async () => {
    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Me',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.nome_mercado');
  });

  it('Rejeita email já cadastrado', async () => {
    mockKnex.transaction = jest.fn().mockImplementation(async (cb: Function) => {
      const trx = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1, email: 'joao@gmail.com' }), // email já existe
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{ id: 1 }]),
      });
      return cb(trx);
    });

    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '01310100',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
    expect(res.body).toHaveProperty('errors.default');
  });

  it('Rejeita CEP inválido', async () => {
    (ViaCEPService.buscarCep as jest.Mock).mockResolvedValue(new Error('CEP não encontrado'));

    const res = await testServer
      .post('/cadastrar/comerciante')
      .send({
        nome: 'João Comerciante',
        email: 'joao@gmail.com',
        senha: '123456',
        cpf: '529.982.247-25',
        cnpj: '11.222.333/0001-81',
        cep: '00000000',
        nome_mercado: 'Mercado do João',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });
});