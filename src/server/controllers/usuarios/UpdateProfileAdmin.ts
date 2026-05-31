import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { LogsProvider } from '../../database/providers/logs';
import { AuthProvider } from '../../database/providers/auth';

interface IParamProps {
  id?: number;
}

interface IBodyProps {
  nome: string;
}

export const updateProfileAdminValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
    })
  ),
}));

export const updateProfileAdmin = async (
  req: Request<IParamProps, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  // Busca o usuário antes de editar para usar o nome antigo no log
  const usuario = await AuthProvider.getById(Number(req.params.id));
  if (usuario instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  const result = await UsuariosProvider.updateProfile(Number(req.params.id), { nome: req.body.nome });
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `Editou o nome do administrador "${usuario.nome}" para "${req.body.nome}"`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.NO_CONTENT).send();
};