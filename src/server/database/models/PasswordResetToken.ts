export interface IPasswordResetToken {
  id?: number;
  usuario_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at?: Date;
}