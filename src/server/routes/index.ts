import { Router } from "express";
import {StatusCodes} from 'http-status-codes';
import { ProdutosController } from "../controllers";
const router = Router();

router.get('/', (_, res) => {
  return res.send('Olá dev!');
});
router.get('/produtos', ProdutosController.getAllValidation, ProdutosController.getAll);
router.post('/produtos',  ProdutosController.createValidation, ProdutosController.create);
router.get('/produtos/:id', ProdutosController.getByIdValidation, ProdutosController.getById);
router.put('/produtos/:id', ProdutosController.updateByIdValidation, ProdutosController.updateById);
router.delete('/produtos/:id', ProdutosController.deleteByIdValidation, ProdutosController.deleteById);

export {router};