/// <reference types="jest" />

jest.mock('../../src/server/database/knex', () => ({
  Knex: {},
}));
import { PasswordCrypto } from '../../src/server/shared/services/PasswordCrypto';

describe('PasswordCrypto', () => {

  describe('hashPassword', () => {
    it('deve gerar um hash diferente da senha original', async () => {
      const senha = 'minha_senha_123';
      const hash = await PasswordCrypto.hashPassword(senha);
      expect(hash).not.toBe(senha);
    });

    it('deve gerar um hash no formato bcrypt', async () => {
      const hash = await PasswordCrypto.hashPassword('senha123');
      expect(hash).toMatch(/^\$2[ab]\$\d+\$/);
    });

    it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
      const senha = 'mesma_senha';
      const hash1 = await PasswordCrypto.hashPassword(senha);
      const hash2 = await PasswordCrypto.hashPassword(senha);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('deve retornar true para senha correta', async () => {
      const senha = 'senha_correta';
      const hash = await PasswordCrypto.hashPassword(senha);
      const resultado = await PasswordCrypto.verifyPassword(senha, hash);
      expect(resultado).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const hash = await PasswordCrypto.hashPassword('senha_correta');
      const resultado = await PasswordCrypto.verifyPassword('senha_errada', hash);
      expect(resultado).toBe(false);
    });

    it('deve retornar false para senha vazia contra hash válido', async () => {
      const hash = await PasswordCrypto.hashPassword('alguma_senha');
      const resultado = await PasswordCrypto.verifyPassword('', hash);
      expect(resultado).toBe(false);
    });

    it('deve ser case-sensitive', async () => {
      const hash = await PasswordCrypto.hashPassword('Senha123');
      const resultado = await PasswordCrypto.verifyPassword('senha123', hash);
      expect(resultado).toBe(false);
    });
  });
});
