# Projeto de Gestão de Voluntários Universitários

## Objetivo

Desenvolver uma aplicação web que auxilie professores na gestão de alunos voluntários em workshops na universidade. O sistema permite que professores cadastrem workshops e gerenciem os alunos participantes, além de gerar certificados de participação.

## Funcionalidades

- **Cadastro de Usuários**: Registro de alunos e professores com informações pessoais.
- **Autenticação e Login**: Acesso seguro ao sistema.
- **Gestão de Workshops**: Professores podem cadastrar e gerenciar workshops.
- **Gestão de Voluntários**: Professores podem adicionar alunos aos workshops.
- **Certificados**: Geração e assinatura de certificados pelos professores.
- **Consulta de Certificados**: Alunos podem buscar seus certificados de participação.
- **Listagem de Workshops**: Usuário pode ver uma lista de workshops de acordo com seu nível de acesso.

## Requisitos Funcionais

1. **Cadastro de Usuários**

   - Permitir que alunos se cadastrem no sistema.
   - Permitir o cadastro interno de prodessores.
   - Armazenar dados do usuário

2. **Autenticação e Login**

   - Implementar um sistema de autenticação para alunos e professores, garantindo acesso seguro ao sistema.

3. **Cadastro e Gestão de Workshops**

   - Professores podem cadastrar novos workshops no sistema.
   - Professores podem gerenciar informações dos workshops.

4. **Gestão de Voluntários**

   - Professores podem adicionar alunos como voluntários em workshops.
   - Professores podem gerenciar a lista de participantes de cada workshop.

5. **Certificados**

   - Professores podem gerar certificados de participação para os alunos.
   - Professores podem assinar digitalmente os certificados.
   - Alunos podem buscar e visualizar seus certificados de participação.

6. **Listagem de Workshops**
   - Alunos podem visualizar a lista de workshops em que participam.
   - Professores podem visualizar a lista de workshops criados por eles.

## Arquitetura em Alto Nível

- **Frontend**

  - Desenvolvido em **Next.js** utilizando **React** para construção da interface de usuário.
  - Estilização com **Tailwind CSS** e componentes do **Shadcn UI**.

- **Backend**

  - API construída com **Next.js Server Actions** para lidar com a lógica de negócios e comunicação com o banco de dados.
  - Utilização do **Drizzle ORM** para interagir com o banco de dados **NeonDB**.

- **Banco de Dados**

  - Utilização do **NeonDB**, que oferece um banco de dados **PostgreSQL**.

- **Autenticação**

  - Implementação de autenticação segura utilizando **Auth.js**.

- **Testes**

  - Estratégia de testes automatizados com testes unitários mockados no backend e testes end-to-end no frontend.

- **Deploy**
  - Hospedagem na **Vercel** para facilidade de deploy contínuo.

## Estratégias de Automação

- **Testes Unitários**

  - Utilizar o **Vitest** para testar funções de lógica de negócio no backend com mocks.

- **Testes End-to-End**

  - Implementar testes com **Playwright** para simular o fluxo completo do usuário no sistema.

- **Integração Contínua (CI)**

  - Configurar pipelines de CI/CD com **GitHub Actions** para executar os testes automaticamente.

## Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento fullstack.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **Tailwind CSS**: Framework de CSS utilitário para estilização rápida.
- **Shadcn UI**: Biblioteca de componentes UI pré-construídos.
- **NeonDB**: Plataforma de backend que fornece banco de dados PostgreSQL.
- **Drizzle ORM**: ORM para interagir com o banco de dados.
- **NextAuth.js**: Biblioteca para autenticação e autorização.
- **Vitest**: Framework de testes unitários.
- **Playwright**: Ferramenta para testes end-to-end.
- **Vercel**: Plataforma de hospedagem e deploy contínuo.
- **Ferramentas Adicionais**: ESLint, Prettier, Git e GitHub.

## Como Executar

1. **Clonar o Repositório**

```bash
   git clone https://github.com/thiagofalasca/projeto-oficina.git
```

2. **Instalar as Dependências**

```bash
   cd projeto-oficina
   npm install
```

3. **Configurar Variáveis de Ambiente**
   Crie um arquivo .env baseado no .env.example e preencha com as configurações necessárias.

4. **Iniciar o Servidor**

```bash
   npm run dev
```

5. **Acessar a Aplicação**
   Abra http://localhost:3000 no seu navegador.

## Comandos disponíveis

- **pnpm dev:** Inicia o ambiente de desenvolvimento.
- **pnpm build:** Cria uma versão de produção.
- **pnpm start:** Inicia o servidor em produção.
- **pnpm test:** Executa os testes unitários.
- **pnpm test:e2e:** Executa os testes end-to-end.
- **pnpm lint:** Analisa o código em busca de problemas.
- **pnpm format:** Formata o código usando Prettier.
- **pnpm db:generate:** Gera migrações SQ: baseadas no schema do banco de dados
- **pnpm db:migrate:** Aplica as migrações no banco de dados
- **pnpm db:studio:** Inicia um servidor Drizzle Studio

## Diagramas do sistema

https://excalidraw.com/#json=tk706rdmxROU2MwbchMcX,QycS_ahjs7_WEI04Oa_--g
