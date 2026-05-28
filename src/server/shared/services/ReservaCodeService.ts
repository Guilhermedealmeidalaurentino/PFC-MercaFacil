export const ReservaCodeService = {
  gerar: (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  },

  validarDataRetirada: (
    dataEscolhida: string,
    horario_abertura: string,
    horario_fechamento: string
  ): Date | Error => {
    const data = new Date(dataEscolhida);
    const agora = new Date();

    if (isNaN(data.getTime())) {
      return new Error('Data inválida');
    }

    // Mínimo: agora + 2h
    const minimaRetirada = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    if (data < minimaRetirada) {
      return new Error('A data de retirada deve ser no mínimo 2 horas a partir de agora');
    }

    // Máximo: agora + 3 dias
    const maximaRetirada = new Date(agora.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (data > maximaRetirada) {
      return new Error('A data de retirada deve ser no máximo 3 dias a partir de hoje');
    }

    // Verifica horário comercial
    const [aberturaH, aberturaM] = horario_abertura.split(':').map(Number);
    const [fechamentoH, fechamentoM] = horario_fechamento.split(':').map(Number);

    const abertura = new Date(data);
    abertura.setHours(aberturaH, aberturaM, 0, 0);

    const fechamento = new Date(data);
    fechamento.setHours(fechamentoH, fechamentoM, 0, 0);

    if (data < abertura || data > fechamento) {
      return new Error(`A retirada deve ser entre ${horario_abertura} e ${horario_fechamento}`);
    }

    return data;
  },
};