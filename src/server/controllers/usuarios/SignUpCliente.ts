import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { AuthProvider } from '../../database/providers/auth';
import { validation } from '../../shared/middleware';


interface IBodyProps{
  nome: string;
  email: string;
  senha: string;
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
          .min(5),

        senha: yup
          .string()
          .required()
          .min(6),
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
    role: 'CLIENTE',
    ativo: true,
  });

  if (result instanceof Error) {
    return res.status(
      StatusCodes.INTERNAL_SERVER_ERROR
    ).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.CREATED).json({
    id: result,
  });
};