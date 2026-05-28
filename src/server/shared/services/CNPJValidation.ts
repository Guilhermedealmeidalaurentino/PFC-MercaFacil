export const CNPJValidation = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/[^\d]/g, '');

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const calcDigit = (cnpj: string, length: number): number => {
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(cnpj.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };

  const firstDigit = calcDigit(cleaned, 12);
  if (firstDigit !== parseInt(cleaned.charAt(12))) return false;

  const secondDigit = calcDigit(cleaned, 13);
  if (secondDigit !== parseInt(cleaned.charAt(13))) return false;

  return true;
};