# Mennu — Frontend  
Sistema Web para gestão de unidades, controle de acesso e monitoramento de consumo alimentar.

Este repositório contém o frontend oficial do **Mennu**, desenvolvido em **Next.js**, utilizando **Material UI** como biblioteca de componentes e **Axios** para comunicação com a API.

---

##  Sumário  
- [Sobre o Projeto](#sobre-o-projeto)  
- [Tecnologias](#tecnologias)  
- [Arquitetura](#arquitetura)  
- [Padrões de Código](#padrões-de-código)  
- [Instalação](#instalação)  
- [Scripts](#scripts)  
- [Estrutura de Pastas](#estrutura-de-pastas)  
- [Chamadas à API (Axios)](#chamadas-à-api-axios)  
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)  
- [Contribuição](#contribuição)  
- [Licença](#licença)

---

#  Sobre o Projeto  

O **Mennu** é uma plataforma completa para gestão de unidades alimentares, controle de acesso por NFC/QR Code e acompanhamento do consumo de refeições.  

Este frontend atende principalmente aos módulos:

- **Controle de Acesso**  
- **Gestão de Unidades**  
- **Políticas por Unidade e Terminal**  
- **Gestão de Usuários**  
- (Futuro) **Relatórios e dashboards**

O foco inicial do projeto é fornecer uma interface robusta e eficiente para operações de controle de acesso e gestão das unidades.

---

#  Tecnologias  

| Área | Tecnologia |
|------|------------|
| Framework | **Next.js 14+ (App Router)** |
| Linguagem | **TypeScript** |
| Componentes UI | **MUI — Material UI** |
| HTTP Client | **Axios** |
| Estado | React Query + Context API |
| Qualidade | ESLint, Prettier, Husky, Commitlint |
| Testes | Jest + Testing Library |

---

#  Arquitetura  

A arquitetura do frontend é organizada com foco em escalabilidade e modularização:

### ✔ App Router (Next.js 14+)  
Todas as rotas são organizadas em `/src/app` usando layouts e segmentos aninhados.

### ✔ Módulos Independentes  
Cada área do sistema possui seu próprio módulo:  
- acesso  
- unidades  
- usuários  
- terminais  
- refeições  
- estoque  

Cada módulo possui a seguinte estrutura: 
- /components
- /api
- /hooks
- /schemas (opcional)

### ✔ Axios Centralizado  
Instância única em `/src/lib/axios.ts` com interceptors configuráveis.

### ✔ React Query  
Cache, sincronização, revalidação automática e otimizações de UI.

### ✔ UI unificada com Material UI  
Tema centralizado em `/src/styles/theme.ts`.

---

#  Padrões de Código  

### ✔ Importações absolutas  
Utilizando prefixo `@/` definido via `tsconfig.json`.

### ✔ Tipagem forte  
Nenhum componente ou função sem TypeScript.

### ✔ Componentes com PascalCase  
Ex.: `UserTable`, `UnitForm`, `AccessCard`.

### ✔ Hooks com prefixo `use`  
Ex.: `useUnidades`, `useCreateUser`.

### ✔ Conventional Commits  
Exemplos:
- feat: adiciona listagem de unidades
- fix: corrige interceptor de token
- refactor: reorganiza módulo de acesso
- chore: atualiza dependências

### ✔ Formatação automática  
ESLint + Prettier + Husky.

---

#  Instalação  

### 1. Clonar o repositório  
```bash
git clone https://github.com/seu-org/mennu-frontend.git
cd mennu
```
### 2. Instalar dependências
```bash
npm install
```
### 3. Criar arquivo .env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```
### 4. Rodar o projeto
```bash
npm run dev
```
# Scripts

| Comando | Descrição |
|------|------------|
| npm run dev | **Inicia o servidor de desenvolvimento** |
| npm run build | **Gera a build de produção** |
| npm run start | **Executa a build** |
| npm run lint | **Roda o ESLint** |
| npm run format | **Formata código com Prettier** |
| npm run test | **Executa testes unitários** |
---
# Estrutura de Pastas
```bash
/src
  /app
    /(routes)
    layout.tsx
    page.tsx
  
  /components
    /ui          
    /layout      

  /modules
    /acesso
      /components
      /api
      /hooks
    /unidades
      /components
      /api
      /hooks
    /usuarios
    /terminais
    /refeicoes
    /estoque

  /lib
    axios.ts
    queryClient.ts

  /styles
    theme.ts
    globals.css

  /types

  /utils
```
# Chamadas a API ( Axios )
```bash
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});
```
### Exemplo de Uso ( Listar Unidades )
```bash
import { api } from "@/lib/axios";

export const listarUnidades = async () => {
  const { data } = await api.get("/unidades/");
  return data;
};
```

# Fluxo de Desenvolvimento
### 1. Criar branch
```bash
git checkout -b feature/nome-da-feature
```
### 2. Implementar UI + Lógica + API
### 3. Criar testes unitários quando aplicável
### 4. Rodar formatação e Lint
### 5. Commitar seguindo Conventional Commits
### 6. Abrir Pull Request
### 7. Passar pela review
### 8. Enviar pra merge na dev


