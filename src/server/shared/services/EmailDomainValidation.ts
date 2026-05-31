const DOMINIOS_VALIDOS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'live.com',
  'icloud.com',
  'me.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'ig.com.br',
  'globo.com',
  'r7.com',
  'msn.com',
  'protonmail.com',
  'proton.me',
  'teste.com',
  'mercafacil.com',
];

export const EmailDomainValidation = (email: string): boolean => {
  const partes = email.toLowerCase().split('@');
  if (partes.length !== 2) return false;
  return DOMINIOS_VALIDOS.includes(partes[1]);
};