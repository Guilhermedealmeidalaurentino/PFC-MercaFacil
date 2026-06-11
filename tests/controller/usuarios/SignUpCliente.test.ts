import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { server } from '../../../src/server/Server';

const testServer = supertest(server);

describe('Usuarios - SignUp Cliente', () => {
  it('Cria um cliente com sucesso', async () => {
  const res = await testServer
    .post('/cadastrar/cliente')
    .send({
      nome: 'Teste Usuario',
      email: 'teste@gmail.com',
      senha: '123456',
      cpf: '529.982.247-25', 
    });

  expect(res.statusCode).toEqual(StatusCodes.CREATED);
});

  it('Rejeita email inválido', async () => {
    const res = await testServer
      .post('/cadastrar/cliente')
      .send({
        nome: 'Teste',
        email: 'email-invalido',
        senha: '123456',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.email');
  });

  it('Rejeita senha muito curta', async () => {
    const res = await testServer
      .post('/cadastrar/cliente')
      .send({
        nome: 'Teste',
        email: 'teste@gmail.com',
        senha: '123',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.senha');
  });

  it('Rejeita nome muito curto', async () => {
    const res = await testServer
      .post('/cadastrar/cliente')
      .send({
        nome: 'Te',
        email: 'teste@gmail.com',
        senha: '123456',
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.nome');
  });
});