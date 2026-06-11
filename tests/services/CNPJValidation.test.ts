/// <reference types="jest" />
jest.mock('../../src/server/database/knex', () => ({
  Knex: {},
}));
import { CNPJValidation } from "../../src/server/shared/services";

describe('CNPJValidation', () => {

  describe('CNPJs válidos', () => {
    it('deve aceitar CNPJ válido sem formatação', () => {
      expect(CNPJValidation('11222333000181')).toBe(true);
    });

    it('deve aceitar CNPJ válido com formatação', () => {
      expect(CNPJValidation('11.222.333/0001-81')).toBe(true);
    });

    it('deve aceitar outro CNPJ válido', () => {
      expect(CNPJValidation('45997418000153')).toBe(true);
    });
  });

  describe('CNPJs inválidos', () => {
    it('deve rejeitar CNPJ com menos de 14 dígitos', () => {
      expect(CNPJValidation('1234567890123')).toBe(false);
    });

    it('deve rejeitar CNPJ com mais de 14 dígitos', () => {
      expect(CNPJValidation('123456789012345')).toBe(false);
    });

    it('deve rejeitar CNPJ com todos os dígitos iguais (00000000000000)', () => {
      expect(CNPJValidation('00000000000000')).toBe(false);
    });

    it('deve rejeitar CNPJ com todos os dígitos iguais (11111111111111)', () => {
      expect(CNPJValidation('11111111111111')).toBe(false);
    });

    it('deve rejeitar CNPJ com dígito verificador errado', () => {
      expect(CNPJValidation('11222333000182')).toBe(false);
    });

    it('deve rejeitar CNPJ vazio', () => {
      expect(CNPJValidation('')).toBe(false);
    });

    it('deve rejeitar CNPJ com letras', () => {
      expect(CNPJValidation('ab.cde.fgh/ijkl-mn')).toBe(false);
    });
  });
});
