# PlenaMente - Sistema de Clínica de Psicologia

Este é o sistema completo da clínica de psicologia **PlenaMente**. A aplicação é dividida em um backend Java Spring Boot com persistência em banco H2 (em memória) e segurança com JWT, e um frontend Angular 22/19 standalone com design premium e fluxo dinâmico baseado em papéis de usuário.

---

## 🛠️ Requisitos Prévios

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Java 21** ou superior.
- **Maven** (opcional, caso prefira usar o wrapper local `mvnw`).
- **Node.js** (v18.x ou superior) e **npm**.
- **Git** para clonar o repositório.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o Repositório
Abra o terminal e execute os comandos abaixo para clonar o projeto e entrar na pasta raiz:
```bash
git clone https://github.com/joaog-alves/antigravityTest_plenamente.git
cd antigravityTest_plenamente
```

---

### 2. Inicializar o Backend (Spring Boot)
O backend é responsável por prover a API REST na porta `8080` e gerenciar o banco de dados.

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
2. Baixe as dependências e inicie o servidor:
   - Se possuir o Maven instalado globalmente:
     ```bash
     mvn spring-boot:run
     ```
   - Caso contrário, utilize o wrapper do Maven (Linux/macOS):
     ```bash
     ./mvnw spring-boot:run
     ```
     *(ou no Windows: `mvnw.cmd spring-boot:run`)*

3. O backend estará ativo em: **`http://localhost:8080`**
4. Para acessar a console do banco de dados H2 e visualizar as tabelas:
   - Acesse **`http://localhost:8080/h2-console`** no navegador.
   - Defina o campo **JDBC URL** como: `jdbc:h2:mem:plenamentedb`
   - Mantenha o usuário como `sa` e deixe a senha em branco. Clique em **Connect**.

---

### 3. Inicializar o Frontend (Angular)
O frontend gerencia as páginas de login, cadastro de usuários e os dashboards interativos.

1. Abra um **novo terminal** na raiz do projeto e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências do projeto (utilize o parametro `--legacy-peer-deps` para evitar conflitos de versão do pacote de animações do Angular 22):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicie o servidor de desenvolvimento do Angular:
   ```bash
   npm run start
   ```
4. Acesse a aplicação no navegador em: **`http://localhost:4200`**

---

## 🔑 Credenciais para Testes

O banco de dados é populado automaticamente com contas de demonstração na primeira inicialização. Na tela de login, você pode clicar nos botões de **Acesso Rápido** no rodapé para preencher os dados instantaneamente, ou utilizar as contas abaixo (senha padrão `senha123`):

| Papel de Usuário | E-mail de Teste | Funcionalidades |
| :--- | :--- | :--- |
| **Paciente** | `paciente@plenamente.com` | Agendar consultas, consultar histórico de consultas realizadas e ler prontuários. |
| **Psicólogo(a)** | `psicologo@plenamente.com` | Confirmar agendamentos, registrar prontuários (diagnóstico e evolução) de consultas e encerrar sessões. |
| **Recepção** | `recepcao@plenamente.com` | Monitorar e confirmar consultas gerais, e agendar consultas para qualquer paciente e psicólogo da clínica. |
| **Supervisão** | `supervisao@plenamente.com` | Acesso completo a painel de métricas da clínica e listagem de usuários com permissão exclusiva para excluir contas. |
