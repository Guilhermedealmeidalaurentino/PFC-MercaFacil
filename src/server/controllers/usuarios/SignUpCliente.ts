import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { AuthProvider } from '../../database/providers/auth';
import { LogsProvider } from '../../database/providers/logs';
import { validation } from '../../shared/middleware';
import { EmailDomainValidation, CPFValidation } from '../../shared/services';

interface IBodyProps {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
}

export const signUpClienteValidation = validation(
  (getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({
        nome: yup.string().required().min(3),
        email: yup
          .string()
          .required()
          .email()
          .min(5)
          .test(
            'dominio-valido',
            'Use um e-mail de um provedor conhecido (gmail, hotmail, outlook...)',
            (value) => EmailDomainValidation(value ?? '')
          ),
        senha: yup.string().required().min(6),
        cpf: yup
          .string()
          .required()
          .test(
            'cpf-valido',
            'CPF inválido',
            (value) => CPFValidation(value ?? '')
          ),
      })
    ),
  })
);

export const signUpCliente = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const result = await AuthProvider.create({
    ...req.body,
    cpf: req.body.cpf.replace(/\D/g, ''),
    role: 'CLIENTE',
    ativo: true,
  });

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  await LogsProvider.registrar(
  result,
  `[CLIENTE] se cadastrou na plataforma`,
  req.body.nome,
  req.body.email,
);

  return res.status(StatusCodes.CREATED).json({ id: result });
};
