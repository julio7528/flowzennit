# Layout das Páginas

Este documento descreve a estrutura visual, os blocos principais e a linguagem de interface das páginas:

- `src/components/blog.jsx`
- `src/components/arealogada/BlogAdmin.jsx`
- `src/components/sobre.jsx`
- `src/components/treinamentos.jsx`

---

## Direção visual compartilhada

As quatro páginas seguem uma identidade visual consistente com o restante do projeto:

- fundo escuro com base em preto e cinza profundo
- contraste alto entre fundo e conteúdo
- uso de acentos neon em cyan, purple e green
- tipografia com combinação de fonte de display e fonte mono
- bordas discretas com transparência
- blocos com estética tecnológica, premium e limpa
- uso de grids, linhas, scanlines e painéis com aparência de interface operacional

Padrões recorrentes:

- `bg-[#050508]` ou superfícies próximas para fundo principal
- `bg-[#0E1016]` para cards, painéis e containers internos
- `border-[#1A1D26]` ou `border-white/10` para separação sutil
- títulos fortes com peso alto
- labels técnicas com fonte mono, caixa alta e tracking amplo
- painéis com visual de dashboard ou terminal

---

## `src/components/blog.jsx`

### Objetivo visual

Página pública de blog com aparência editorial tecnológica, mantendo coerência com as páginas institucionais do projeto.

### Estrutura principal

1. Header global do site
2. Barra superior fixa de status do blog
3. Layout principal em duas colunas no desktop
4. Sidebar lateral com arquivo de postagens
5. Área principal com listagem ou post completo
6. Footer global do site

### Layout da home do blog

Quando a rota é `/blog`, a área principal é organizada assim:

1. Postagem mais recente em destaque
2. Grade com os 3 posts seguintes
3. Lista histórica das demais postagens

#### Sidebar

- largura fixa no desktop
- agrupamento das postagens por mês e ano
- cada item mostra título e data
- item ativo recebe destaque visual com cyan
- comportamento sticky em telas maiores

#### Destaque principal

- card grande com borda sutil e brilho leve
- grid em duas colunas no desktop
- texto principal à esquerda
- imagem de capa à direita
- CTA para abrir a postagem completa

#### Blocos dos últimos 3 posts

- cards em grade
- imagem no topo
- data, título e resumo abaixo
- hover com reforço de borda

#### Lista das demais postagens

- bloco simples com linhas divisórias
- cada item mostra data e título
- foco em leitura rápida e navegação

### Layout da postagem completa

Quando a rota é `/blog/:slug`, a página mostra:

1. botão de voltar ao índice
2. data de publicação
3. imagem de capa ampla
4. título principal
5. resumo
6. conteúdo completo renderizado
7. bloco de like
8. bloco de comentários

### Conteúdo renderizado

O corpo do artigo usa uma área `.blog-content` com estilos para:

- `h1`
- `h2`
- `p`
- `ul`
- `ol`
- `img`
- `a`

Isso permite exibir HTML salvo no banco com aparência editorial consistente.

### Interações

- like com contador no final do post
- formulário de comentário
- feedback textual após ações
- fallback visual para loading, erro e ausência de posts

### Responsividade

- no mobile, a estrutura em colunas colapsa para fluxo vertical
- sidebar deixa de ser lateral e vira bloco acima do conteúdo
- cards mantêm legibilidade sem depender de largura fixa

---

## `src/components/arealogada/BlogAdmin.jsx`

### Objetivo visual

Painel editorial interno com aparência de dashboard administrativo, alinhado ao estilo da área logada.

### Estrutura principal

1. barra superior do módulo
2. layout principal dividido em colunas
3. coluna lateral de postagens
4. área central de edição
5. coluna direita com capa, preview e ações

### Organização geral

O layout usa uma composição semelhante a um sistema editorial:

- sidebar esquerda para navegação entre posts
- centro para formulário e editor
- direita para preview e operações

### Sidebar de postagens

- lista todas as entradas
- mostra status publicado ou rascunho
- exibe data, título e resumo
- item selecionado recebe destaque visual
- funciona como painel de navegação editorial

### Área central do editor

Contém:

1. cabeçalho contextual da edição
2. campos de título e slug
3. campo de resumo
4. toolbar do editor rico
5. área `contentEditable` para o corpo do texto

### Toolbar do editor

A toolbar disponibiliza:

- negrito
- itálico
- heading 1
- heading 2
- lista não ordenada
- lista ordenada
- inserção de imagem
- cor do texto
- tamanho do texto

Visualmente:

- botões compactos
- bordas discretas
- hover neon
- fundo escuro uniforme

### Coluna direita

É dividida em três blocos:

1. upload e preview da imagem de capa
2. preview resumido da postagem
3. ações de publicação

#### Ações disponíveis

- salvar rascunho
- publicar postagem
- visualizar no blog
- limpar formulário
- excluir postagem quando estiver editando

### Feedback de estado

O painel exibe mensagens de:

- erro
- sucesso
- carregamento de lista
- upload de imagem
- salvamento

### Responsividade

- em telas menores, a coluna lateral e a coluna direita descem no fluxo
- no desktop, o layout funciona como painel tripartido

---

## `src/components/sobre.jsx`

### Objetivo visual

Página institucional com forte identidade tecnológica e pessoal, combinando portfólio, terminal e dashboard narrativo.

### Estrutura principal

1. Header global
2. Main container com múltiplas seções
3. Footer global
4. Overlay visual estilo CRT

### Blocos principais

#### Barra de status

- faixa superior sticky
- indicador de disponibilidade
- pequenos painéis informativos com experiência, localização e stack

#### Hero em duas colunas

Coluna esquerda:

- imagem de destaque com sobreposição
- nome principal em tipografia forte
- links de contato e GitHub

Coluna direita:

- card estilo terminal
- conteúdo em pseudo-código apresentando perfil profissional

#### Grid principal

Divide o conteúdo em três áreas:

1. timeline de carreira
2. card central de posicionamento profissional
3. grid de áreas de atuação

#### Faixa metodológica inferior

- seção horizontal com etapas do fluxo
- ícones, labels e linhas animadas
- visual de processo tecnológico

#### Seção de certificações

- cards menores em grid
- dois blocos adicionais com formação e projetos

### Recursos visuais marcantes

- scanline / CRT overlay
- grid pattern
- sombras neon cyan e purple
- estética inspirada em terminal, interface sci-fi e dashboard técnico

### Responsividade

- grandes grids quebram para colunas únicas em telas menores
- hero e dashboard central mantêm hierarquia vertical clara

---

## `src/components/treinamentos.jsx`

### Objetivo visual

Página institucional de cursos e treinamentos com linguagem de trilha formativa, combinando operação, metodologia e interface de sistema.

### Estrutura principal

1. Header global
2. Main container com seções temáticas
3. Overlay CRT visual
4. Footer global

### Blocos principais

#### Barra de status

- sticky abaixo do header
- indicadores rápidos de módulos, metodologias e formatos

#### Hero em duas colunas

Coluna esquerda:

- painel visual com grid, gradientes e scanline
- headline forte
- pills com números-chave
- CTAs principais

Coluna direita:

- card estilo terminal/jornada
- resumo estruturado da trilha
- fluxo vertical com etapas metodológicas

#### Seção de pilares

- 3 cards principais
- cada card comunica um fundamento da proposta
- ícones, cor de destaque e barra animada

#### Seção de módulos

- grandes cards horizontais
- divisão entre objetivo e tópicos abordados
- forte estrutura editorial e técnica

#### Seção de fluxo metodológico

- grade em 4 etapas
- seta entre fases
- relação visual entre conceito e execução

#### Seção de modalidades

- bloco explicativo sobre formatos
- cards para aulas ao vivo e conteúdo gravado
- lista de benefícios ao lado

#### CTA final

- bloco de encerramento com chamada forte
- botões de ação
- uso de gradientes e linhas horizontais decorativas

### Recursos visuais marcantes

- grids
- scanline animada
- blocos com aparência de terminal e painel tático
- tipografia de display + mono
- uso forte de cyan, purple e green para separar conceitos

### Responsividade

- grids e colunas colapsam para fluxo vertical
- cards permanecem legíveis em mobile
- CTAs e destaques continuam claros em telas menores

---

## Comparativo rápido

### `blog.jsx`

- foco editorial público
- mistura de revista digital com painel tecnológico
- ênfase em leitura, arquivo e navegação entre posts

### `BlogAdmin.jsx`

- foco operacional e de gestão de conteúdo
- estrutura de CMS interno
- ênfase em edição, preview e publicação

### `sobre.jsx`

- foco institucional e pessoal
- composição mais narrativa e visualmente expressiva
- ênfase em identidade profissional

### `treinamentos.jsx`

- foco institucional e didático
- estrutura orientada a fluxo, módulos e aprendizagem
- ênfase em trilha metodológica

---

## Observações finais

- `blog.jsx` e `BlogAdmin.jsx` foram desenhadas para conversar com `sobre.jsx` e `treinamentos.jsx`, mas com finalidade diferente:
  - o blog público herda a atmosfera institucional
  - o admin herda a lógica de painel da área logada
- as quatro páginas compartilham o mesmo vocabulário visual, mas cada uma prioriza um tipo de leitura:
  - institucional
  - editorial
  - operacional
  - formativo
