import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';

export const ReportsProvider = {

  // Lista todos os reports com informações do mercado e cliente
  getAll: async () => {
    try {
      const result = await Knex(ETablesNames.report_nao_retirada)
        .select(
          `${ETablesNames.report_nao_retirada}.*`,
          `${ETablesNames.mercado}.nome_mercado`,
          `${ETablesNames.usuario}.nome as nome_cliente`,
          `${ETablesNames.usuario}.email as email_cliente`,
        )
        .join(
          ETablesNames.mercado,
          `${ETablesNames.mercado}.id`,
          `${ETablesNames.report_nao_retirada}.mercado_id`
        )
        .join(
          ETablesNames.usuario,
          `${ETablesNames.usuario}.id`,
          `${ETablesNames.report_nao_retirada}.cliente_id`
        )
        .orderBy(`${ETablesNames.report_nao_retirada}.created_at`, 'desc');

      return result;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao buscar reports');
    }
  },

  // Marca um report como visualizado pelo admin
  marcarVisualizado: async (id: number) => {
    try {
      const result = await Knex(ETablesNames.report_nao_retirada)
        .where('id', id)
        .update({ visualizado: true });

      if (result === 0) return new Error('Report não encontrado');
      return;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao atualizar report');
    }
  },

  // Conta reports não visualizados (útil para badge de notificação no admin)
  countNaoVisualizados: async () => {
    try {
      const result = await Knex(ETablesNames.report_nao_retirada)
        .where('visualizado', false)
        .count('id as total')
        .first();

      return Number(result?.total || 0);
    } catch (error) {
      console.log(error);
      return new Error('Erro ao contar reports');
    }
  },
};