interface IViaCEPResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const ViaCEPService = {
  buscarCep: async (cep: string): Promise<IViaCEPResponse | Error> => {
    try {
      const cleaned = cep.replace(/\D/g, '');

      if (cleaned.length !== 8) {
        return new Error('CEP deve ter 8 dígitos');
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);

      if (!response.ok) {
        return new Error('Erro ao consultar CEP');
      }

      const data: IViaCEPResponse = await response.json();

      if (data.erro) {
        return new Error('CEP não encontrado');
      }

      return data;

    } catch (error) {
      return new Error('Erro ao consultar CEP');
    }
  },
};