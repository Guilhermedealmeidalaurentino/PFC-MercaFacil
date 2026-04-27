import { Router } from "express";
import { ProdutosController, AuthController } from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";
const router = Router();

router.get('/', (_, res) => {
  return res.send('Olá dev!');
});
router.get('/produtos',ensureAuthenticated, ProdutosController.getAllValidation, ProdutosController.getAll);
router.post('/produtos',ensureAuthenticated,  ProdutosController.createValidation, ProdutosController.create);
router.get('/produtos/:id',ensureAuthenticated, ProdutosController.getByIdValidation, ProdutosController.getById);
router.put('/produtos/:id',ensureAuthenticated, ProdutosController.updateByIdValidation, ProdutosController.updateById);
router.delete('/produtos/:id',ensureAuthenticated, ProdutosController.deleteByIdValidation, ProdutosController.deleteById);

router.post('/entrar', AuthController.signInValidation, AuthController.signIn);
router.post('/cadastrar', AuthController.signUpValidation, AuthController.signUp);
export {router};