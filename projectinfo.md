# ProjectInfo - FlowZenit (React + Vite)

## Visao geral
Landing page single-page para o produto ficticio FlowZenit (plataforma de produtividade open source). O foco e apresentar proposta de valor, funcionalidades, integracoes e captacao de leads, com visual neon/futurista e animacoes.

## Dados tecnicos
- Stack: React 19 + Vite (rolldown-vite), Tailwind CSS v4 (via @import "tailwindcss"), Framer Motion, Lucide React.
- Roteamento: react-router-dom esta instalado, mas nao ha rotas no codigo atual (app single page).
- Lint/Test: ESLint configurado; Vitest e Testing Library instalados, mas nao ha testes.
- Build: `npm run dev`, `npm run build`, `npm run preview`.
- Assets locais: logos em `src/assets` (favicon, logofull.png, logominimal.png, logo.ai).
- Imagens remotas: varias sections usam imagens externas (Unsplash e Googleusercontent).

## Estrutura do projeto
- `src/main.jsx`: bootstrap do React com StrictMode.
- `src/App.jsx`: compoe a pagina com os componentes na ordem:
  1) TopBanner
  2) Header
  3) Hero
  4) FeatureStrip
  5) MainFeatures
  6) NewFeatures
  7) Contacts
  8) Cta
  9) Footer
- `src/index.css`: tema Tailwind v4 com cores customizadas, utilitarios de gradiente e padrao grid.
- `src/App.css`: CSS padrao do template Vite (nao utilizado no app atual).
- `src/components/*`: componentes de layout e conteudo.

## Abordagem de UI/UX
- Estilo neon/futurista com fundo escuro, gradientes e padrao de grid.
- Animacoes de entrada e hover com Framer Motion (stagger, fade, slide, scale).
- Secoes com IDs para navegacao por ancoras (ex.: #funcionalidades, #metodologia, #ciencia, #contato, #cta).
- Responsividade baseada em Tailwind (grid, breakpoints md/lg, layout mobile first).

## Como funciona (fluxo da pagina)
- TopBanner: aviso superior com CTA de contato.
- Header: barra fixa com logo, menu (desktop) e menu colapsavel (mobile) com CTA.
- Hero: mensagem principal, CTAs e um SVG ilustrativo do fluxo (GUT -> PDCA -> IA -> resultado).
- FeatureStrip: faixa de 4 pilares; clique abre modal com detalhes (AnimatePresence).
- MainFeatures: grid com 6 funcionalidades principais.
- NewFeatures: 2 cards de novas integracoes (Google Calendar e WhatsApp).
- Contacts: formulario de contato (inputs apenas visuais, sem submit real).
- Cta: secao final com chamada para criar conta e ler documentacao.
- Footer: links institucionais e copyright.

## Conteudo e copy (resumo)
- Proposta: transformar caos em produtividade combinando GTD, MASP, GUT e PDCA.
- Pilares: open source, metodologias pragmaticas, IA auxiliar e interface cognitiva.
- Funcionalidades: priorizacao por Matriz GUT, ciclo PDCA, copiloto neural, analytics, GitOps, seguranca.
- Integracoes futuras: Google Calendar e WhatsApp.
- CTA: criar conta gratuita e acessar documentacao.

## Observacoes importantes
- Ha textos com caracteres corrompidos (ex.: "Começar"); provavelmente problema de encoding. Vale revisar strings para UTF-8.
- Varias imagens sao externas; se precisar de offline ou performance, mover para `public/` ou `src/assets`.
- `App.css` nao e importado; pode ser removido ou integrar caso necessario.

## Uso futuro
Este projeto serve como base de landing page para produtos SaaS, com estrutura modular por componentes e facil expansao de novas secoes (ex.: pricing, depoimentos, FAQ). Pode ser adaptado para multi-pagina caso `react-router-dom` seja utilizado.

## Diagrama de fluxo (pagina)
```
[main.jsx] -> [App.jsx]
    |
[TopBanner] (src/components/banner.jsx)
    |
[Header] (sticky) (src/components/header.jsx)
    |
[Hero] (src/components/hero.jsx)
    |
[FeatureStrip] (src/components/featurestrip.jsx) -- clique --> [Modal de detalhe]
    |
[MainFeatures] (src/components/mainfeatures.jsx)
    |
[NewFeatures] (integracoes) (src/components/newfeatures.jsx)
    |
[Contacts] (form) (src/components/contacts.jsx)
    |
[Cta] (src/components/cta.jsx)
    |
[Footer] (src/components/footer.jsx)
```

## Identidade visual tecnica (guia de reuso frontend)

### Direcao visual
- Estetica principal: neon/futurista com base escura, contraste alto e acentos luminosos.
- Linguagem: camadas com transparencias (`/5`, `/10`, `/20`), blur e gradientes para profundidade.
- Estrategia de composicao: seções escuras com CTA de alto contraste em fundo claro (bloco `Cta`).

### Tokens de cor oficiais (src/index.css)
- `bgDark`: `#0b0b16` (fundo principal da aplicacao)
- `bgCard`: `#120b1f` (cards e superfícies elevadas)
- `footerBg`: `#0a0a14` (fundo dedicado ao rodape)
- `hotPink`: `#ff4fd8` (acento forte/energia)
- `neonCyan`: `#67e8f9` (acento de interacao/destaque)
- `neonPurple`: `#8b5cf6` (acento de marca/gradiente)

### Cores complementares usadas no projeto
- Texto base claro: `#f8fafc` (body)
- Branco: `#ffffff` (titulos, botoes, contraste)
- Tons neutros Tailwind: `gray-300/400/500/600/800/900` em textos secundarios e estados.
- Sobreposicoes e bordas: `white/5`, `white/10`, `white/20`, `black/20`, `black/80`.
- Roxo escuro de atmosfera: `purple-900/20`, `purple-600/10`, `purple-950` (banner e glows).

### Gradientes e efeitos padrao
- Gradiente primario (`.bg-gradient-primary`): `#7c3aed -> #8b5cf6 -> #7c3aed` (botoes principais e CTA).
- Gradiente de texto (`.text-gradient`): `#ff4fd8 -> #8b5cf6 -> #22d3ee`.
- Grid de fundo (`.bg-grid-pattern`): linhas com `rgba(148, 163, 184, 0.18)` para textura tecnica.
- Glow/halo: aplicado com blur e opacidade baixa em ciano/roxo/rosa para foco visual.

### Mapeamento de uso por componente
- `App`/layout: fundo global `bg-bgDark` com selecao `selection:bg-hotPink`.
- `Header`: fundo translucido escuro (`bg-bgDark/80`) com blur.
- `Hero`: destaque com `text-gradient`, badge ciano e CTA com gradiente primario.
- `FeatureStrip`/modais/cards: `bg-bgCard`, bordas sutis e destaques ciano/rosa/roxo.
- `Contacts`: inputs escuros com foco `neonPurple`.
- `Footer`: `bg-footerBg`, texto neutro e hover de links em `neonCyan`.
- `Cta`: excecao de alto contraste (`bg-white text-black`) para fechamento da jornada.

### Regras para novas paginas (consistencia)
- Manter a base escura (`bgDark`) em paginas de produto/conteudo.
- Reservar o gradiente primario para acoes de alta prioridade (CTA principal).
- Usar `neonCyan` para estados interativos (hover, foco, links ativos).
- Usar `hotPink` para pontos de energia visual (badges, highlights, selecao).
- Limitar efeitos de glow para evitar ruido visual e preservar legibilidade.
- Preservar contraste minimo em textos secundarios (evitar cinzas muito apagados em fundos escuros).

### Observacao tecnica
- A classe `text-textGray` e usada em varios componentes, mas o token `--color-textGray` nao aparece definido em `src/index.css`. Para padronizar, vale adicionar esse token no tema ou substituir por um tom `gray-*` explicito.
