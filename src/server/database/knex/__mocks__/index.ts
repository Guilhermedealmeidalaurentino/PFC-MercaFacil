const mockTrx = {
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(null),
  insert: jest.fn().mockResolvedValue([1]),
  returning: jest.fn().mockResolvedValue([{ id: 1 }]),
  update: jest.fn().mockResolvedValue(1),
  delete: jest.fn().mockResolvedValue(1),
};

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  whereNull: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(null),
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

const mockKnex: any = jest.fn().mockReturnValue(mockQueryBuilder);

mockKnex.transaction = jest.fn().mockImplementation(async (cb: any) => cb(mockTrx));
mockKnex.migrate = {
  latest: jest.fn().mockResolvedValue(undefined),
  rollback: jest.fn().mockResolvedValue(undefined),
};
mockKnex.destroy = jest.fn().mockResolvedValue(undefined);

export const knex = jest.fn().mockReturnValue(mockKnex);
export const Knex = mockKnex;
export default mockKnex;