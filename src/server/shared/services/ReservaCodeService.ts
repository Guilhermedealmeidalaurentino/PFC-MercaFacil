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
  horario_fechamento: string,
): Date | Error => {
  const data = new Date(dataEscolhida);
  const agora = new Date();

  if (isNaN(data.getTime())) {
    return new Error('Data inválida');
  }

  const minimaRetirada = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
  if (data < minimaRetirada) {
    return new Error('A data de retirada deve ser no mínimo 2 horas a partir de agora');
  }

  const maximaRetirada = new Date(agora.getTime() + 3 * 24 * 60 * 60 * 1000);
  if (data > maximaRetirada) {
    return new Error('A data de retirada deve ser no máximo 3 dias a partir de hoje');
  }

  // Usar getHours/getMinutes (horário local) em vez de UTC
  const horaData = data.getHours() * 60 + data.getMinutes();
  const [abH, abM] = horario_abertura.split(':').map(Number);
  const [feH, feM] = horario_fechamento.split(':').map(Number);
  const abertura = abH * 60 + abM;
  const fechamento = feH * 60 + feM;

  if (horaData < abertura || horaData > fechamento) {
    return new Error(
      `A retirada deve ser entre ${horario_abertura} e ${horario_fechamento}`
    );
  }

  return data;
},
};