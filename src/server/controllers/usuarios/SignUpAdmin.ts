import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { AuthProvider } from '../../database/providers/auth';
import { LogsProvider } from '../../database/providers/logs';
import { validation } from '../../shared/middleware';

interface IBodyProps {
  nome: string;
  email: string;
  senha: string;
}

export const signUpAdminValidation = validation(
  (getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({
        nome: yup.string().required().min(3),
        email: yup.string().required().email().min(5),
        senha: yup.string().required().min(6),
      })
    ),
  })
);

export const signUpAdmin = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  const result = await AuthProvider.create({
    ...req.body,
    role: 'ADMIN',
    ativo: true,
    aguardando_exclusao: false,
  });

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `Criou um novo administrador chamado "${req.body.nome}" (${req.body.email})`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.CREATED).json({ id: result });
};