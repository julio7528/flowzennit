# FlowZenit

Plataforma web de produtividade com foco em organização de tarefas, priorização e gestão de fluxo de trabalho. O projeto combina uma landing page institucional com uma área logada para operação diária, com autenticação via Supabase e interface moderna em React.

## ✨ Visão geral

O FlowZenit foi estruturado em duas frentes:

- **Landing page pública** para apresentar proposta de valor, funcionalidades e captação de contatos.
- **Área autenticada** para gestão operacional (dashboard, tarefas, projetos, categorias e relatórios).

A experiência visual adota identidade futurista (neon + dark mode), com animações usando Framer Motion e componentes responsivos com Tailwind.

## 🧱 Stack tecnológica

- **Frontend:** React 19 + Vite 5
- **Roteamento:** React Router DOM 7
- **Estilo:** Tailwind CSS v4 + CSS customizado
- **Animações/UI:** Framer Motion + Lucide React
- **Backend as a Service:** Supabase (auth + banco)
- **Testes:** Vitest + Testing Library + JSDOM
- **Lint:** ESLint 9

## 📁 Estrutura do projeto

```text
flowzennit/
├─ src/
│  ├─ components/
│  │  ├─ arealogada/        # páginas e componentes da área logada
│  │  ├─ dashboard/         # layout/dashboard adicional
│  │  ├─ *.jsx|*.tsx        # páginas públicas, auth e blocos da landing
│  ├─ assets/               # logos, ilustrações e imagens locais
│  ├─ lib/
│  │  └─ supabase.js        # inicialização do cliente Supabase
│  ├─ test/                 # setup e testes de interface
│  ├─ App.jsx               # composição da landing principal
│  ├─ main.jsx              # bootstrap + rotas da aplicação
│  └─ index.css             # tokens visuais e estilos globais
├─ public/
├─ vercel.json              # config de deploy (SPA rewrite)
├─ vite.config.js           # config Vite + Vitest
└─ package.json
```

## 🧭 Rotas da aplicação

### Públicas

- `/` → Landing page principal
- `/detailedfeatures`
- `/metodologia`
- `/ciencia`
- `/sobre`
- `/documentacao`
- `/login`
- `/auth/callback`

### Protegidas (exigem sessão)

- `/dashboard`
- `/cad-categorias`
- `/cad-subcategorias`
- `/cad-participantes`
- `/boxes/stuff`
- `/boxes/trash`
- `/boxes/algum-dia`
- `/boxes/referencia`
- `/tarefas`
- `/reports`
- `/projetos`

A proteção é feita por `ProtectedRoute`, que valida sessão no Supabase e redireciona usuários não autenticados para `/login`.

## 🔐 Autenticação e dados

A autenticação utiliza Supabase (`@supabase/supabase-js`) com:

- Login por email/senha
- Login social com Google OAuth
- Cadastro de conta
- Recuperação de senha
- Callback de autenticação

Além da sessão, o projeto registra/consulta controle de acesso em `tbf_controle_usuario` e envia contatos da landing para `tbf_contato`.

## ⚙️ Configuração de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

Sem essas variáveis, funcionalidades de autenticação e envio de contato não funcionarão corretamente.

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js **20.x** (conforme `package.json`)
- npm

### Passo a passo

```bash
# 1) instalar dependências
npm install

# 2) iniciar ambiente de desenvolvimento
npm run dev

# 3) gerar build de produção
npm run build

# 4) pré-visualizar build
npm run preview
```

## 🧪 Qualidade e testes

Comandos disponíveis:

```bash
# análise estática
npm run lint

# testes unitários/integrados (modo CI)
npm run test

# testes em watch
npm run test:watch
```

Atualmente há testes cobrindo:

- Renderização das seções principais da landing
- Fluxo de envio do formulário de contato

## 🎨 Diretrizes visuais

- Tema base escuro com alto contraste
- Acentos neon (ciano, roxo e rosa)
- Gradientes para CTAs e destaque de texto
- Componentes com blur, bordas translúcidas e microinterações

As customizações de tema estão centralizadas principalmente em `src/index.css`.

## ☁️ Deploy

O projeto está preparado para deploy em plataformas compatíveis com Vite.

No caso da Vercel, `vercel.json` define:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Reescrita global para `index.html` (necessária para SPA com React Router)


Se quiser, posso também criar uma versão deste README com:

1. **Foco para usuários finais** (menos técnico), ou
2. **Foco para desenvolvedores** (mais arquitetura, banco e fluxos de autenticação).
