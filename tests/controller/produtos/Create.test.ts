import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import { JWTService } from '../../../src/server/shared/services';
import { server } from '../../../src/server/Server';
import { MercadosProvider } from '../../../src/server/database/providers/mercados';
import { ProdutosProvider } from '../../../src/server/database/providers/produtos';

jest.mock('../../../src/server/database/providers/mercados');
jest.mock('../../../src/server/database/providers/produtos');

const testServer = supertest(server);

describe('Produtos - Create', () => {
  const accessToken = JWTService.sign({ uid: 1, role: 'MERCADO' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Tenta criar um registro sem token de acesso', async () => {
    const res = await testServer
      .post('/produtos')
      .send({
        nome: 'Leite Integral',
        descricao: 'Leite longa vida',
        categoria: 'Laticínios',
        marca: 'Piracanjuba',
        preco: 7,
        estoque: 100,
      });

    expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors.default');
  });

  it('Cria registro', async () => {
    (MercadosProvider.getByUsuarioId as jest.Mock).mockResolvedValue({
      id: 1,
      nome_mercado: 'Mercado Teste',
    });

    (ProdutosProvider.create as jest.Mock).mockResolvedValue(99);

    const res = await testServer
      .post('/produtos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Leite Integral',
        descricao: 'Leite longa vida',
        categoria: 'Laticínios',
        marca: 'Piracanjuba',
        preco: 7,
        estoque: 100,
      });

    expect(res.statusCode).toEqual(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
  });

  it('Tenta criar um registro com nome muito curto', async () => {
    const res = await testServer
      .post('/produtos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Le',
        descricao: 'Leite longa vida',
        categoria: 'Laticínios',
        marca: 'Piracanjuba',
        preco: 7,
        estoque: 100,
      });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors.body.nome');
  });

  it('Tenta criar um registro sem campos obrigatórios', async () => {
    const res = await testServer
      .post('/produtos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Leite Integral' });

    expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it('Rejeita token inválido', async () => {
    const res = await testServer
      .post('/produtos')
      .set({ Authorization: 'Bearer token_invalido' })
      .send({
        nome: 'Leite Integral',
        descricao: 'Leite longa vida',
        categoria: 'Laticínios',
        marca: 'Piracanjuba',
        preco: 7,
        estoque: 100,
      });

    expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  });
});