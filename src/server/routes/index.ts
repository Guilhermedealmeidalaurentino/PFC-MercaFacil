// src/server/routes/index.ts

import { Router } from "express";
import { ProdutosController, AuthController, UsuariosController, ReservasController, MercadosController, ReportsController, LogsController } from "../controllers";
import { ensureAuthenticated } from "../shared/middleware";

const router = Router();

router.get('/', (_, res) => res.send('Olá dev!'));

// ─── Reservas ─────────────────────────────────────────────────────────────────
router.post('/reservas', ensureAuthenticated, ReservasController.createReservaValidation, ReservasController.createReserva);
router.get('/reservas/minhas', ensureAuthenticated, ReservasController.getReservasCliente);
router.get('/reservas/mercado', ensureAuthenticated, ReservasController.getReservasMercado);
router.patch('/reservas/:id/status', ensureAuthenticated, ReservasController.updateStatusValidation, ReservasController.updateStatus);
router.patch('/reservas/:id/cancelar', ensureAuthenticated, ReservasController.cancelarReservaValidation, ReservasController.cancelarReserva);
router.get('/reservas/:id', ensureAuthenticated, ReservasController.getReservaByIdValidation, ReservasController.getReservaById);

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/entrar', AuthController.signInValidation, AuthController.signIn);
router.get('/me', ensureAuthenticated, AuthController.getMe);
router.post('/auth/forgot-password', AuthController.forgotPasswordValidation, AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPasswordValidation, AuthController.resetPassword);

// ─── Cadastro ─────────────────────────────────────────────────────────────────
router.post('/cadastrar/cliente', UsuariosController.signUpClienteValidation, UsuariosController.signUpCliente);
router.post('/cadastrar/comerciante', UsuariosController.signUpComercianteValidation, UsuariosController.signUpComerciante);
router.post('/cadastrar/admin', ensureAuthenticated, UsuariosController.signUpAdminValidation, UsuariosController.signUpAdmin);

// ─── Produtos ─────────────────────────────────────────────────────────────────
router.get('/produtos', ensureAuthenticated, ProdutosController.getAllValidation, ProdutosController.getAll);
router.post('/produtos', ensureAuthenticated, ProdutosController.createValidation, ProdutosController.create);
router.get('/produtos/:id', ensureAuthenticated, ProdutosController.getByIdValidation, ProdutosController.getById);
router.put('/produtos/:id', ensureAuthenticated, ProdutosController.updateByIdValidation, ProdutosController.updateById);
router.delete('/produtos/:id', ensureAuthenticated, ProdutosController.deleteByIdValidation, ProdutosController.deleteById);

// ─── Perfil do usuário ────────────────────────────────────────────────────────
router.patch('/usuarios/perfil', ensureAuthenticated, UsuariosController.updateProfileValidation, UsuariosController.updateProfile);
router.patch('/usuarios/senha', ensureAuthenticated, UsuariosController.resetPasswordValidation, UsuariosController.resetPassword);
router.get('/usuarios/perfil', ensureAuthenticated, UsuariosController.getById);
router.delete('/usuarios/me', ensureAuthenticated, UsuariosController.deleteById);
router.delete('/usuarios/me/cancelar-exclusao', ensureAuthenticated, UsuariosController.cancelarExclusao); // novo

// ─── Mercados (público/comerciante) ───────────────────────────────────────────
router.get('/mercados', ensureAuthenticated, MercadosController.getAllValidation, MercadosController.getAll);
router.get('/mercados/:id', ensureAuthenticated, MercadosController.getById);
router.put('/mercados/:id', ensureAuthenticated, MercadosController.updateByIdValidation, MercadosController.updateById);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.get('/reports', ensureAuthenticated, ReportsController.getAll);
router.get('/reports/count', ensureAuthenticated, ReportsController.countNaoVisualizados);
router.patch('/reports/:id/visualizado', ensureAuthenticated, ReportsController.marcarVisualizado);

router.get('/usuarios', ensureAuthenticated, UsuariosController.getAllValidation, UsuariosController.getAll);
router.delete('/admin/usuarios/:id', ensureAuthenticated, UsuariosController.deleteByIdAdminValidation, UsuariosController.deleteByIdAdmin);
router.get('/admin/logs', ensureAuthenticated, LogsController.getLogs);
router.patch('/admin/usuarios/:id', ensureAuthenticated, UsuariosController.updateProfileAdminValidation, UsuariosController.updateProfileAdmin);
router.patch('/admin/usuarios/:id/ativo', ensureAuthenticated, UsuariosController.toggleAtivoValidation, UsuariosController.toggleAtivo);
router.get('/admin/usuarios', ensureAuthenticated, UsuariosController.getAllAdminValidation, UsuariosController.getAllAdmin);

router.get('/admin/mercados', ensureAuthenticated, MercadosController.getAllAdminValidation, MercadosController.getAllAdmin);
router.delete('/admin/mercados/:id', ensureAuthenticated, MercadosController.deleteByIdAdminValidation, MercadosController.deleteByIdAdmin);
router.patch('/admin/mercados/:id/ativo', ensureAuthenticated, MercadosController.toggleAtivoMercadoValidation, MercadosController.toggleAtivoMercado);

router.get('/admin/reservas', ensureAuthenticated, ReservasController.getAllAdmin);


export { router };