# 🛒 MercaFácil Backend

API REST responsável pelas regras de negócio, autenticação, gerenciamento de produtos, reservas e integração com serviços externos do sistema MercaFácil.

O projeto foi desenvolvido como parte do Projeto de Finalização de Curso (PFC), com foco na organização do atendimento em pequenos mercados através da reserva antecipada de produtos.

---

## 📌 Objetivo

O backend do MercaFácil centraliza toda a lógica da aplicação, garantindo segurança, controle de acesso, gerenciamento de reservas e comunicação com o banco de dados.

---

## ✨ Principais Funcionalidades

### Autenticação

* Login com JWT
* Recuperação de senha
* Controle de permissões por perfil
* Criptografia de senhas com Bcrypt

### Gestão de Produtos

* Cadastro de produtos
* Atualização de produtos
* Exclusão de produtos
* Controle de estoque

### Gestão de Reservas

* Criação de reservas
* Cancelamento de reservas
* Controle de status
* Validação de horários disponíveis

### Administração

* Gerenciamento de usuários
* Ativação e desativação de contas
* Gerenciamento de mercados
* Dashboard administrativo

---

## 📋 Regras de Negócio

O sistema implementa algumas regras para garantir o correto funcionamento das reservas:

* Reservas podem ser realizadas com até 3 dias de antecedência;
* Horários de retirada são disponibilizados em intervalos de 30 minutos;
* O comerciante deve possuir pelo menos 2 horas para preparação dos pedidos;
* Não são permitidas reservas para o mesmo dia quando faltarem menos de 2 horas para o fechamento do mercado;
* Usuários podem ser desativados em casos de infrações ou excesso de reservas não retiradas.

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express
* TypeScript
* JWT
* Bcrypt
* Yup

### Banco de Dados

* PostgreSQL
* Knex.js

### APIs Externas

* ViaCEP
* Resend

---

## 🏗️ Arquitetura

O sistema utiliza arquitetura cliente-servidor baseada em API REST.

Estrutura principal:

* Controllers
* Providers
* Services
* Middlewares
* Database

---

## 🚀 Instalação

### Clonar o repositório

```bash
git clone https://github.com/Guilhermedealmeidalaurentino/PFC-MercaFacil.git
```

### Acessar a pasta

```bash
cd PFC-MercaFacil
```

### Instalar dependências

```bash
npm install
```

ou

```bash
yarn
```

### Configurar variáveis de ambiente

```env
APP_PORT=
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
```

### Executar projeto

```bash
npm run dev
```
---

## 🔐 Segurança

O sistema utiliza:

* JWT para autenticação;
* Hash de senha com Bcrypt;
* Validação de dados com Yup;
* Controle de permissões por perfil;
* Adequação à LGPD.

---

## ☁️ Infraestrutura

* Backend hospedado no Render;
* Banco de dados PostgreSQL hospedado no Render;
* Frontend hospedado na Vercel.

---

## 🔗 Frontend

Interface da aplicação:

https://github.com/Guilhermedealmeidalaurentino/mercafacil-frontend

---

## 👨‍💻 Autor

Guilherme de Almeida

Projeto desenvolvido como Trabalho de Conclusão de Curso (PFC).
