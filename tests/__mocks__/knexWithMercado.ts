const mockMercado = { id: 1, nome_mercado: 'Mercado Teste', usuario_id: 1, ativo: true };

const mockTrxMercado = {
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(mockMercado),
  insert: jest.fn().mockResolvedValue([1]),
  returning: jest.fn().mockResolvedValue([{ id: 1 }]),
  update: jest.fn().mockResolvedValue(1),
  delete: jest.fn().mockResolvedValue(1),
};

const mockQueryBuilderMercado = {
  where: jest.fn().mockReturnThis(),
  whereNull: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(mockMercado),
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([{ id: 1 }]),
  update: jest.fn().mockResolvedValue(1),
  delete: jest.fn().mockResolvedValue(1),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  count: jest.fn().mockResolvedValue([{ count: '0' }]),
};

const mockKnexMercado: any = jest.fn().mockReturnValue(mockQueryBuilderMercado);

mockKnexMercado.transaction = jest.fn().mockImplementation(async (cb: any) => cb(mockTrxMercado));
mockKnexMercado.migrate = {
  latest: jest.fn().mockResolvedValue(undefined),
  rollback: jest.fn().mockResolvedValue(undefined),
};
mockKnexMercado.destroy = jest.fn().mockResolvedValue(undefined);

const knexMercado = jest.fn().mockReturnValue(mockMercado);

module.exports = knexMercado;
module.exports.knex = knexMercado;
module.exports.Knex = mockKnexMercado;
module.exports.default = knexMercado;