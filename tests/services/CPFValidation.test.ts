/// <reference types="jest" />

jest.mock('../../src/server/database/knex', () => ({
  Knex: {},
}));
import { CPFValidation } from '../../src/server/shared/services/CPFValidation';

describe('CPFValidation', () => {

  describe('CPFs válidos', () => {
    it('deve aceitar CPF válido sem formatação', () => {
      expect(CPFValidation('52998224725')).toBe(true);
    });

    it('deve aceitar CPF válido com pontos e traço', () => {
      expect(CPFValidation('529.982.247-25')).toBe(true);
    });

    it('deve aceitar outro CPF válido', () => {
      expect(CPFValidation('111.444.777-35')).toBe(true);
    });
  });

  describe('CPFs inválidos', () => {
    it('deve rejeitar CPF com menos de 11 dígitos', () => {
      expect(CPFValidation('1234567890')).toBe(false);
    });

    it('deve rejeitar CPF com mais de 11 dígitos', () => {
      expect(CPFValidation('123456789012')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais (00000000000)', () => {
      expect(CPFValidation('00000000000')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais (11111111111)', () => {
      expect(CPFValidation('11111111111')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais (99999999999)', () => {
      expect(CPFValidation('99999999999')).toBe(false);
    });

    it('deve rejeitar CPF com dígitos verificadores errados', () => {
      expect(CPFValidation('52998224726')).toBe(false);
    });

    it('deve rejeitar CPF vazio', () => {
      expect(CPFValidation('')).toBe(false);
    });

    it('deve rejeitar CPF com letras', () => {
      expect(CPFValidation('abc.def.ghi-jk')).toBe(false);
    });
  });
});
