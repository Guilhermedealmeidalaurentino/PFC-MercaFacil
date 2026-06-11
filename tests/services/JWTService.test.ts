/// <reference types="jest" />

jest.mock('../../src/server/database/knex', () => ({
  Knex: {},
}));
import { JWTService } from '../../src/server/shared/services/JWTService';

describe('JWTService', () => {

  const payload = { uid: 1, role: 'CLIENTE' as const };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_mercafacil';
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  describe('sign', () => {
    it('deve gerar um token JWT válido', () => {
      const token = JWTService.sign(payload);
      expect(typeof token).toBe('string');
      expect(token).not.toBe('JWT_SECRET_NOT_FOUND');
    });

    it('deve retornar JWT_SECRET_NOT_FOUND quando a variável de ambiente não está definida', () => {
      const secret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const token = JWTService.sign(payload);
      expect(token).toBe('JWT_SECRET_NOT_FOUND');

      process.env.JWT_SECRET = secret;
    });
  });

  describe('verify', () => {
    it('deve verificar e retornar os dados do token corretamente', () => {
      const token = JWTService.sign(payload) as string;
      const result = JWTService.verify(token);

      expect(result).not.toBe('INVALID_TOKEN');
      expect(result).not.toBe('JWT_SECRET_NOT_FOUND');
      expect((result as any).uid).toBe(payload.uid);
      expect((result as any).role).toBe(payload.role);
    });

    it('deve retornar INVALID_TOKEN para um token malformado', () => {
      const result = JWTService.verify('token.invalido.aqui');
      expect(result).toBe('INVALID_TOKEN');
    });

    it('deve retornar INVALID_TOKEN para string vazia', () => {
      const result = JWTService.verify('');
      expect(result).toBe('INVALID_TOKEN');
    });

    it('deve retornar JWT_SECRET_NOT_FOUND quando a variável de ambiente não está definida', () => {
      const token = JWTService.sign(payload) as string;
      const secret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const result = JWTService.verify(token);
      expect(result).toBe('JWT_SECRET_NOT_FOUND');

      process.env.JWT_SECRET = secret;
    });

    it('deve assinar e verificar para role MERCADO', () => {
      const token = JWTService.sign({ uid: 2, role: 'MERCADO' }) as string;
      const result = JWTService.verify(token) as any;
      expect(result.role).toBe('MERCADO');
      expect(result.uid).toBe(2);
    });

    it('deve assinar e verificar para role ADMIN', () => {
      const token = JWTService.sign({ uid: 3, role: 'ADMIN' }) as string;
      const result = JWTService.verify(token) as any;
      expect(result.role).toBe('ADMIN');
      expect(result.uid).toBe(3);
    });
  });
});
