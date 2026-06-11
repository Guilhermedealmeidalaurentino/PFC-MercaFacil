/// <reference types="jest" />

jest.mock('../../src/server/database/knex', () => ({ Knex: {} }));

import { ReservaCodeService } from '../../src/server/shared/services/ReservaCodeService';

describe('ReservaCodeService', () => {

  describe('gerar', () => {
    it('deve gerar um código com 8 caracteres', () => {
      const codigo = ReservaCodeService.gerar();
      expect(codigo).toHaveLength(8);
    });

    it('deve gerar apenas letras maiúsculas e números', () => {
      const codigo = ReservaCodeService.gerar();
      expect(codigo).toMatch(/^[A-Z0-9]{8}$/);
    });

    it('deve gerar códigos diferentes a cada chamada', () => {
      const codigos = new Set(Array.from({ length: 20 }, () => ReservaCodeService.gerar()));
      expect(codigos.size).toBeGreaterThan(1);
    });
  });

  describe('validarDataRetirada', () => {

    const abertura = '08:00';
    const fechamento = '20:00';

    const pad = (n: number) => String(n).padStart(2, '0');

    const dataComHora = (diasAFrente: number, hora: number, minuto = 0): string => {
      const d = new Date();
      d.setDate(d.getDate() + diasAFrente);
      d.setHours(hora, minuto, 0, 0);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hora)}:${pad(minuto)}`;
    };

    it('deve retornar um objeto Date para data válida dentro do horário', () => {
      const data = dataComHora(1, 10); // amanhã às 10:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Date);
    });

    it('deve retornar erro para data inválida', () => {
      const resultado = ReservaCodeService.validarDataRetirada('data-invalida', abertura, fechamento);
      expect(resultado).toBeInstanceOf(Error);
      expect((resultado as Error).message).toBe('Data inválida');
    });

    it('deve retornar erro para data com menos de 2 horas de antecedência', () => {
      // Data no passado
      const d = new Date();
      d.setMinutes(d.getMinutes() - 10);
      const data = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const resultado = ReservaCodeService.validarDataRetirada(data, '00:00', '23:59');
      expect(resultado).toBeInstanceOf(Error);
      expect((resultado as Error).message).toContain('mínimo 2 horas');
    });

    it('deve retornar erro para data com mais de 3 dias de antecedência', () => {
      const data = dataComHora(4, 10); // 4 dias no futuro às 10:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Error);
      expect((resultado as Error).message).toContain('máximo 3 dias');
    });

    it('deve retornar erro para horário fora do funcionamento (antes da abertura)', () => {
      const data = dataComHora(1, 6); // amanhã às 06:00 — antes das 08:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Error);
      expect((resultado as Error).message).toContain('08:00');
    });

    it('deve retornar erro para horário fora do funcionamento (após fechamento)', () => {
      const data = dataComHora(1, 22); // amanhã às 22:00 — após 20:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Error);
      expect((resultado as Error).message).toContain('20:00');
    });

    it('deve aceitar data exatamente no horário de abertura', () => {
      const data = dataComHora(1, 8); // amanhã às 08:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Date);
    });

    it('deve aceitar data exatamente no horário de fechamento', () => {
      const data = dataComHora(1, 20); // amanhã às 20:00
      const resultado = ReservaCodeService.validarDataRetirada(data, abertura, fechamento);
      expect(resultado).toBeInstanceOf(Date);
    });
  });
});