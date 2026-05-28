import { Router } from "express";
import { ProdutosController, AuthController, UsuariosController, ReservasController} from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";
const router = Router();
console.log('getMe:', AuthController.getMe);

router.get('/', (_, res) => res.send('Olá dev!'));

// Reservas
router.post('/reservas', ensureAuthenticated, ReservasController.createReservaValidation, ReservasController.createReserva);
router.get('/reservas/minhas', ensureAuthenticated, ReservasController.getReservasCliente);
router.get('/reservas/mercado', ensureAuthenticated, ReservasController.getReservasMercado);
router.patch('/reservas/:id/status', ensureAuthenticated, ReservasController.updateStatusValidation, ReservasController.updateStatus);
router.patch('/reservas/:id/cancelar', ensureAuthenticated, ReservasController.cancelarReservaValidation, ReservasController.cancelarReserva);
router.get('/reservas/:id', ensureAuthenticated, ReservasController.getReservaByIdValidation, ReservasController.getReservaById);
// Auth
router.post('/entrar', AuthController.signInValidation, AuthController.signIn);
router.get('/me', ensureAuthenticated, AuthController.getMe);

// Cadastro
router.post('/cadastrar/cliente', UsuariosController.signUpClienteValidation, UsuariosController.signUpCliente);
router.post('/cadastrar/comerciante', UsuariosController.signUpComercianteValidation, UsuariosController.signUpComerciante);
router.post('/cadastrar/admin', ensureAuthenticated, UsuariosController.signUpAdminValidation, UsuariosController.signUpAdmin);

// Produtos (protegidas)
router.get('/produtos', ensureAuthenticated, ProdutosController.getAllValidation, ProdutosController.getAll);
router.post('/produtos', ensureAuthenticated, ProdutosController.createValidation, ProdutosController.create);
router.get('/produtos/:id', ensureAuthenticated, ProdutosController.getByIdValidation, ProdutosController.getById);
router.put('/produtos/:id', ensureAuthenticated, ProdutosController.updateByIdValidation, ProdutosController.updateById);
router.delete('/produtos/:id', ensureAuthenticated, ProdutosController.deleteByIdValidation, ProdutosController.deleteById);

// Perfil do usuário autenticado
router.patch('/usuarios/perfil', ensureAuthenticated, UsuariosController.updateProfileValidation, UsuariosController.updateProfile);
router.patch('/usuarios/senha', ensureAuthenticated, UsuariosController.resetPasswordValidation, UsuariosController.resetPassword);
router.get('/usuarios/perfil', ensureAuthenticated, UsuariosController.getById);

export { router };