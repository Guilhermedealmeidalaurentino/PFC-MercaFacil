import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middleware";
import { StatusCodes } from "http-status-codes";
import { AuthProvider } from "../../database/providers/auth";

interface IBodyProps {
  email: string;
  senha: string;
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      email: yup.string().email().required(),
      senha: yup.string().required().min(3)
    })
  ),
}));

export const create = async (req: Request<{}, {}, IBodyProps>,res: Response) => {
  const result = await AuthProvider.create(req.body);
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};