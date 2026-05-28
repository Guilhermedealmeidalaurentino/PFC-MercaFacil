export interface IReserva {
  id?: number;
  cliente_id: number;
  mercado_id: number;
  status: 'PENDENTE' | 'CONFIRMADA' | 'RETIRADA' | 'CANCELADA';
  codigo_retirada?: string;
  data_reserva?: Date;
  data_retirada: Date;
}