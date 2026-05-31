import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MercadosProvider } from '../../database/providers/mercados';
import * as yup from 'yup';

interface IParamProps {
  id?: string;
}

const getByIdValidation = yup.object().shape({
  id: yup.number().integer().required().moreThan(0),
});

export const getById = async (
  req: Request<IParamProps>,
  res: Response
) => {
  const body = await getByIdValidation.validate(
    { id: req.params.id },
    { abortEarly: false }
  ).catch((err) => err);

  if (body instanceof yup.ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: body.message },
    });
  }

  const result = await MercadosProvider.getById(Number(req.params.id));

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};