import { Request, Response } from "express";
import * as yup from 'yup';
import { validation } from "../../shared/middleware";
interface IProduto{
  nome: string;
  preco: number;
  estoque: number;
}
export const createValidation = validation((getSchema) =>({
body:getSchema<IProduto>(yup.object().shape({
  nome: yup.string().required().min(3),
  preco: yup.number().required().positive(),
  estoque: yup.number().required().positive()
})),
}));
export const create = async (req:Request<{},{}, IProduto>,res: Response) =>{
  console.log(req.body);
  return res.send('Create!');
};