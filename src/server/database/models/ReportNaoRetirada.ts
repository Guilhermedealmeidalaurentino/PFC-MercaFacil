export interface IReportNaoRetirada {
  id?: number;
  reserva_id: number;
  mercado_id: number;
  cliente_id: number;
  motivo: string;
  visualizado: boolean;
  created_at?: string;
}