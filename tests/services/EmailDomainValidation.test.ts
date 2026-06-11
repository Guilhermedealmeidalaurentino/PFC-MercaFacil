/// <reference types="jest" />

jest.mock('../../src/server/database/knex', () => ({
  Knex: {},
}));
import { EmailDomainValidation } from '../../src/server/shared/services/EmailDomainValidation';

describe('EmailDomainValidation', () => {

  describe('Domínios válidos', () => {
    it('deve aceitar email com domínio gmail.com', () => {
      expect(EmailDomainValidation('usuario@gmail.com')).toBe(true);
    });

    it('deve aceitar email com domínio hotmail.com', () => {
      expect(EmailDomainValidation('usuario@hotmail.com')).toBe(true);
    });

    it('deve aceitar email com domínio outlook.com', () => {
      expect(EmailDomainValidation('usuario@outlook.com')).toBe(true);
    });

    it('deve aceitar email com domínio yahoo.com', () => {
      expect(EmailDomainValidation('usuario@yahoo.com')).toBe(true);
    });

    it('deve aceitar email com domínio yahoo.com.br', () => {
      expect(EmailDomainValidation('usuario@yahoo.com.br')).toBe(true);
    });

    it('deve aceitar email com domínio mercafacil.com', () => {
      expect(EmailDomainValidation('admin@mercafacil.com')).toBe(true);
    });

    it('deve aceitar email com domínio teste.com', () => {
      expect(EmailDomainValidation('teste@teste.com')).toBe(true);
    });

    it('deve aceitar email com letras maiúsculas (case-insensitive)', () => {
      expect(EmailDomainValidation('Usuario@GMAIL.COM')).toBe(true);
    });
  });

  describe('Domínios inválidos', () => {
    it('deve rejeitar email com domínio desconhecido', () => {
      expect(EmailDomainValidation('usuario@dominiofalso.com')).toBe(false);
    });

    it('deve rejeitar email sem @', () => {
      expect(EmailDomainValidation('usuariogmail.com')).toBe(false);
    });

    it('deve rejeitar email com dois @', () => {
      expect(EmailDomainValidation('usuario@@gmail.com')).toBe(false);
    });

    it('deve rejeitar string vazia', () => {
      expect(EmailDomainValidation('')).toBe(false);
    });

    it('deve rejeitar email com domínio corporativo aleatório', () => {
      expect(EmailDomainValidation('usuario@empresa.com.br')).toBe(false);
    });
  });
});
