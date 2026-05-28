import { Router } from "express";
import { ProdutosController, AuthController, UsuariosController, ReservasController, MercadosController } from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";
const router = Router();
console.log('getMe:', AuthController.getMe);

router.get('/', (_, res) => res.send('Olá dev!'));

// rotas da reserva
router.post('/reservas', ensureAuthenticated, ReservasController.createReservaValidation, ReservasController.createReserva);
router.get('/reservas/minhas', ensureAuthenticated, ReservasController.getReservasCliente);
router.get('/reservas/mercado', ensureAuthenticated, ReservasController.getReservasMercado);
router.patch('/reservas/:id/status', ensureAuthenticated, ReservasController.updateStatusValidation, ReservasController.updateStatus);
router.patch('/reservas/:id/cancelar', ensureAuthenticated, ReservasController.cancelarReservaValidation, ReservasController.cancelarReserva);
router.get('/reservas/:id', ensureAuthenticated, ReservasController.getReservaByIdValidation, ReservasController.getReservaById);

// rotas de autenticação
router.post('/entrar', AuthController.signInValidation, AuthController.signIn);
router.get('/me', ensureAuthenticated, AuthController.getMe);

// rotas de cadastro
router.post('/cadastrar/cliente', UsuariosController.signUpClienteValidation, UsuariosController.signUpCliente);
router.post('/cadastrar/comerciante', UsuariosController.signUpComercianteValidation, UsuariosController.signUpComerciante);
router.post('/cadastrar/admin', ensureAuthenticated, UsuariosController.signUpAdminValidation, UsuariosController.signUpAdmin);

// rotas do produto
router.get('/produtos', ensureAuthenticated, ProdutosController.getAllValidation, ProdutosController.getAll);
router.post('/produtos', ensureAuthenticated, ProdutosController.createValidation, ProdutosController.create);
router.get('/produtos/:id', ensureAuthenticated, ProdutosController.getByIdValidation, ProdutosController.getById);
router.put('/produtos/:id', ensureAuthenticated, ProdutosController.updateByIdValidation, ProdutosController.updateById);
router.delete('/produtos/:id', ensureAuthenticated, ProdutosController.deleteByIdValidation, ProdutosController.deleteById);

// rotas do perfil do usuário autenticado
router.patch('/usuarios/perfil', ensureAuthenticated, UsuariosController.updateProfileValidation, UsuariosController.updateProfile);
router.patch('/usuarios/senha', ensureAuthenticated, UsuariosController.resetPasswordValidation, UsuariosController.resetPassword);
router.get('/usuarios/perfil', ensureAuthenticated, UsuariosController.getById);

//rotas do mercado
router.get('/mercados', ensureAuthenticated, MercadosController.getAllValidation, MercadosController.getAll);
router.get('/mercados/:id', ensureAuthenticated, MercadosController.getById);
export { router };