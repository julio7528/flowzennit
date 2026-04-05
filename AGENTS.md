# agents.md

## 1. Objetivo deste documento

Este documento define a referência oficial para implementação do pacote de conformidade LGPD do projeto. O objetivo é orientar o Codex a construir, em uma única entrega coesa, os seguintes entregáveis:

1. **Consentimento de cookies**
2. **Página de Privacidade / LGPD**
3. **Governança mínima de privacidade**

A implementação deve respeitar a identidade visual já existente no projeto e reutilizar a linguagem de layout observada nas páginas `sobre.jsx` e `treinamentos.jsx`.

---

## 2. Contexto do projeto

O site/plataforma:

- possui autenticação e cadastro de conta;
- grava dados de conta no Supabase;
- grava também os cadastros/entradas criados pelo próprio usuário dentro da plataforma;
- já possui **RLS configurado**;
- precisa adicionar camada de privacidade em conformidade com a LGPD;
- não terá, por enquanto, foco internacional; o escopo principal é **legislação brasileira**;
- precisa ter um banner inicial de consentimento;
- precisa salvar a escolha do usuário em `localStorage`;
- **não deve carregar Google Analytics diretamente antes do consentimento**;
- precisa ter uma **página de privacidade** com política clara e formulário de solicitação de exclusão de dados / solicitações do titular;
- deve manter coerência com o layout visual já existente no projeto.

---

## 3. Escopo fechado da entrega

### 3.1 Entregáveis obrigatórios

#### A. Consentimento de cookies
Implementar um sistema de consentimento com:

- banner inicial em português;
- linguagem adequada à LGPD;
- opção de aceitar, rejeitar opcionais e configurar;
- link para a página de privacidade;
- armazenamento local da decisão do usuário;
- bloqueio de scripts opcionais até consentimento.

#### B. Página de Privacidade / LGPD
Criar uma página pública dedicada à privacidade, contendo:

- política de privacidade;
- política de cookies;
- seção de direitos do titular;
- formulário de solicitação de exclusão / solicitação LGPD;
- explicação clara sobre compartilhamento com terceiros.

#### C. Governança mínima
Implementar a camada mínima de governança para o produto:

- inventário de dados tratados nesta primeira versão;
- inventário de terceiros relevantes;
- definição de categorias de cookies;
- persistência de consentimento no front;
- fluxo funcional para solicitação do titular;
- estrutura para futura auditoria/evolução.

---

## 4. Fora de escopo nesta fase

Não implementar agora, salvo se já for muito simples no contexto do código existente:

- CMP externa de mercado;
- internacionalização completa da política;
- geolocalização por país;
- painel jurídico administrativo complexo;
- integração com reCAPTCHA;
- gestão enterprise de consentimento multi-dispositivo;
- versão multilíngue;
- sistema avançado de retenção automatizada.

---

## 5. Informações confirmadas para esta implementação

### 5.1 Dados coletados

#### Dados de conta
Tratar como dados de conta, de forma genérica e segura:

- nome;
- e-mail;
- identificadores da conta;
- demais dados básicos de cadastro já utilizados na autenticação/perfil.

#### Dados criados pelo usuário
A plataforma também trata os **dados cadastrados pelo próprio usuário dentro do sistema**.

Esses dados devem ser descritos na política como:

- registros operacionais criados pelo usuário;
- cadastros internos feitos pelo usuário na plataforma;
- conteúdo inserido pelo usuário para organização, gestão e uso do sistema.

Não inventar categorias novas sem necessidade. Descrever isso de forma ampla, objetiva e coerente com o produto.

#### Dados técnicos
Nesta versão, considerar apenas:

- registro de consentimento;
- cookies e tecnologias semelhantes necessários para o funcionamento do site e preferências de privacidade.

### 5.2 Terceiros / compartilhamento confirmado

O texto e a implementação devem considerar explicitamente:

- **Supabase** → infraestrutura de backend, autenticação e armazenamento de dados;
- **Google Analytics** → medição e análise de uso, apenas com consentimento quando aplicável;
- **YouTube embed** → conteúdo incorporado de terceiros, quando houver mídia embarcada.

### 5.3 Itens explicitamente ausentes

Não mencionar como ativos se não existem:

- **não há reCAPTCHA**;
- **não há mapa**;
- não incluir Pixel, Meta Ads, Hotjar, Clarity ou outros rastreadores se não existirem no código.

---

## 6. Princípios obrigatórios da solução

1. **Privacidade por padrão**
   - cookies opcionais devem iniciar desativados;
   - scripts opcionais não devem carregar antes do consentimento.

2. **Clareza de interface**
   - nada de linguagem confusa ou excessivamente jurídica no banner;
   - texto direto, em português brasileiro.

3. **Controle real do usuário**
   - aceitar;
   - rejeitar opcionais;
   - configurar preferências;
   - revisar preferências posteriormente.

4. **Coerência visual com o projeto**
   - não usar um modal genérico com cara de biblioteca externa;
   - precisa parecer parte nativa do produto.

5. **Implementação incremental limpa**
   - separar UI, lógica de consentimento e carregamento condicional de scripts.

---

## 7. Arquitetura funcional esperada

### 7.1 Estrutura de alto nível

A solução deve ser dividida em pelo menos estes blocos:

- `CookieConsentBanner` → banner inicial
- `CookiePreferencesModal` → modal/painel de configuração
- `PrivacyPage` → página de privacidade/LGPD
- `consent-storage` ou utilitário equivalente → persistência local
- `analytics-loader` ou utilitário equivalente → carregamento condicional do GA

### 7.2 Rotas esperadas

Criar ou adaptar uma rota pública como:

- `/privacidade`

Se houver boa razão estrutural, pode usar algo equivalente, desde que seja claro e estável.

### 7.3 Ponto de abertura posterior

Após o usuário salvar qualquer decisão, deve existir um meio de reabrir as preferências, por exemplo:

- link no footer;
- link dentro da página `/privacidade`;
- botão “Gerenciar cookies” na própria política.

---

## 8. Regras do banner inicial

### 8.1 Objetivo

O banner inicial deve informar de forma clara que o site utiliza cookies e tecnologias semelhantes para:

- funcionamento do site;
- registro das preferências de privacidade;
- medição de uso, quando autorizado.

### 8.2 Botões obrigatórios

#### Botão 1: `Aceitar opcionais`
Ação esperada:

- ativa categorias opcionais previstas (especialmente medição/analytics);
- salva a decisão no `localStorage`;
- fecha o banner;
- libera o carregamento do Google Analytics.

#### Botão 2: `Rejeitar opcionais`
Ação esperada:

- mantém ativos apenas os cookies estritamente necessários;
- salva a decisão no `localStorage`;
- fecha o banner;
- garante que Google Analytics não seja carregado.

#### Botão 3: `Configurar`
Ação esperada:

- abre o modal/painel de preferências;
- permite granularidade por categoria.

#### Link auxiliar: `Política de Privacidade e Cookies`
Ação esperada:

- navega para `/privacidade`.

### 8.3 Texto sugerido do banner

Usar uma versão próxima desta ideia, adaptando ao tom do projeto:

> Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento do site, registrar suas preferências de privacidade e, com sua autorização, medir o uso da plataforma para melhorias contínuas. Você pode aceitar os opcionais, rejeitá-los ou configurar suas preferências. Saiba mais em nossa Política de Privacidade e Cookies.

### 8.4 Comportamento de exibição

- exibir apenas se ainda não houver decisão salva;
- não reaparecer a cada navegação após decisão válida;
- reaparecer caso a versão do consentimento mude no futuro.

---

## 9. Regras do modal/painel “Configurar”

### 9.1 Objetivo

O painel de configuração deve permitir controle claro por categoria. Não criar categorias desnecessárias só para imitar CMP de mercado.

### 9.2 Categorias obrigatórias nesta versão

#### 1. Necessários

- sempre ativos;
- não desligáveis;
- incluem funcionamento do site, autenticação, persistência básica e armazenamento da preferência de consentimento.

#### 2. Medição e desempenho

- opcional;
- controla o Google Analytics;
- inicia desativado por padrão;
- só ativa após consentimento explícito.

### 9.3 Categorias opcionais condicionais

#### Funcionalidade
Só incluir se houver funcionalidade real no produto que dependa disso.

Exemplos aceitáveis:

- preferência de interface não essencial;
- personalizações de uso não estritamente necessárias.

Se não houver uso claro no projeto, **não incluir essa categoria**.

#### Marketing
Não incluir nesta fase se não houver tecnologia real correspondente.

### 9.4 Botões do modal

- `Salvar preferências`
- `Aceitar opcionais`
- `Rejeitar opcionais`

### 9.5 Requisitos de UX

- linguagem simples;
- categorias com título + descrição curta;
- estado visual claro ligado/desligado;
- mobile responsivo;
- visual alinhado ao design system do projeto.

---

## 10. Persistência em localStorage

### 10.1 Chave obrigatória sugerida

Usar uma chave estável, por exemplo:

```txt
flowzenit_cookie_consent
```

### 10.2 Estrutura sugerida do objeto

```json
{
  "version": "1.0",
  "necessary": true,
  "analytics": false,
  "functionality": false,
  "marketing": false,
  "consentGivenAt": "2026-04-05T15:10:00.000Z"
}
```

### 10.3 Regras de persistência

- `necessary` deve ser sempre `true`;
- `analytics` controla o GA;
- `functionality` só é relevante se essa categoria existir;
- `marketing` deve permanecer `false` se a categoria não existir;
- armazenar também `version` para futura evolução de política e reconsentimento.

### 10.4 Regras de leitura

Ao iniciar a aplicação:

- ler o objeto salvo;
- validar schema mínimo;
- se inválido, tratar como ausência de consentimento;
- renderizar banner quando necessário.

---

## 11. Google Analytics — regra obrigatória

### 11.1 Regra principal

**Não carregar o Google Analytics automaticamente no carregamento inicial da aplicação.**

### 11.2 Comportamento correto

- antes do consentimento: GA não deve ser injetado;
- com rejeição de opcionais: GA continua desativado;
- com aceite de medição: GA pode ser carregado;
- após alteração de preferência: o estado deve refletir a nova escolha para medições futuras.

### 11.3 Estratégia técnica esperada

Implementar carregamento condicional via utilitário/função dedicada, por exemplo:

- verificar `consent.analytics`;
- injetar script do GA somente quando `true`;
- evitar duplicação de script;
- centralizar a lógica em arquivo próprio.

### 11.4 Restrições

- não deixar snippet do GA hardcoded de forma a carregar sempre;
- não disparar pageview se analytics não estiver autorizado.

---

## 12. Página `/privacidade` — estrutura obrigatória

A página de privacidade deve unificar os temas de LGPD e cookies em uma única experiência bem organizada.

### 12.1 Seções obrigatórias

#### 1. Hero / introdução
Explicar de forma breve:

- compromisso com privacidade;
- transparência no tratamento de dados;
- possibilidade de gerenciar preferências e solicitar direitos.

#### 2. Quem somos / controlador
Apresentar:

- nome do projeto/plataforma;
- canal de contato para privacidade;
- descrição curta do papel da plataforma como agente que trata os dados do usuário para funcionamento do serviço.

#### 3. Quais dados tratamos
Separar em blocos:

- dados de conta;
- dados inseridos pelo usuário;
- dados técnicos de consentimento e cookies/tecnologias semelhantes.

#### 4. Finalidades do tratamento
Explicar, de forma objetiva:

- criação e gestão de conta;
- autenticação e acesso;
- armazenamento e organização dos registros do usuário;
- funcionamento do serviço;
- medição de uso da plataforma, quando autorizada;
- exibição/incorporação de conteúdo de terceiros, quando aplicável.

#### 5. Compartilhamento com terceiros
Citar claramente:

- Supabase;
- Google Analytics;
- YouTube embed.

Descrever cada um em linguagem simples:

- por que existe;
- em qual contexto atua;
- que tipo de tratamento ou suporte fornece.

#### 6. Cookies e tecnologias semelhantes
Explicar:

- o que são;
- quais categorias são usadas no site;
- quais são necessários;
- quais dependem de consentimento;
- como revisar preferências.

#### 7. Direitos do titular
Apresentar ao menos:

- solicitar acesso aos dados;
- solicitar correção;
- solicitar exclusão;
- revogar consentimento de cookies opcionais;
- solicitar informações adicionais sobre o tratamento.

#### 8. Solicitações LGPD / formulário
Incluir formulário dentro da própria página.

#### 9. Atualizações desta política
Informar que o conteúdo pode ser atualizado e que a data de revisão deve ser exibida.

---

## 13. Formulário de solicitação LGPD

### 13.1 Objetivo

Permitir que o usuário faça solicitações relacionadas aos seus dados pessoais dentro da própria página de privacidade.

### 13.2 Não limitar apenas à exclusão

Mesmo que a exclusão seja a principal demanda, o componente deve ser pensado como um formulário de **solicitações do titular**.

### 13.3 Tipos de solicitação sugeridos

- confirmar tratamento de dados;
- solicitar acesso aos dados;
- solicitar correção de dados;
- solicitar exclusão de conta e dados;
- revogar consentimento de cookies opcionais;
- solicitar esclarecimentos sobre privacidade.

### 13.4 Campos sugeridos

- nome;
- e-mail;
- tipo de solicitação;
- mensagem / detalhes;
- checkbox de confirmação, quando necessário para exclusão.

### 13.5 Comportamento esperado

- validação de campos obrigatórios;
- feedback de sucesso/erro;
- UX coerente com o restante do projeto;
- mensagem clara informando que a solicitação será analisada.

### 13.6 Persistência recomendada

Se a estrutura do projeto permitir, salvar em uma tabela dedicada no Supabase, por exemplo:

- `privacy_requests`

Campos sugeridos:

- `id`
- `name`
- `email`
- `request_type`
- `message`
- `status`
- `created_at`

Se isso não for implementado nesta fase, ao menos deixar a arquitetura preparada para isso.

---

## 14. Governança mínima obrigatória

### 14.1 Inventário mínimo de dados

Documentar e refletir na política apenas estes grupos já confirmados:

- dados de conta;
- dados criados pelo usuário dentro da plataforma;
- consentimento e cookies/tecnologias semelhantes.

### 14.2 Inventário mínimo de terceiros

Documentar:

- Supabase;
- Google Analytics;
- YouTube embed.

### 14.3 Canal de contato de privacidade

A página deve exibir um canal visível para contato relacionado à privacidade.

Se o projeto ainda não tiver e-mail dedicado, usar provisoriamente o canal institucional existente, mas deixar o texto preparado para futura substituição por um canal específico.

### 14.4 Estrutura de revisão futura

A solução deve ser escrita de forma que seja fácil evoluir depois para:

- versão de política;
- consentimento persistido também no backend;
- trilha de auditoria;
- retenção/anonimização;
- centro de preferências mais completo.

---

## 15. Direção visual obrigatória

O layout deve seguir a identidade já presente no projeto, especialmente as referências de `sobre.jsx` e `treinamentos.jsx`.

### 15.1 Base visual

Reutilizar a linguagem já adotada:

- fundo escuro principal;
- superfícies internas escuras e sofisticadas;
- contraste forte entre fundo e texto;
- acentos em cyan, purple e green;
- aparência tecnológica, premium e nativa do produto;
- uso de bordas discretas e transparência;
- estética entre dashboard, terminal e institucional técnico.

### 15.2 Elementos visuais desejáveis

Usar quando fizer sentido, sem exagero:

- grid pattern sutil;
- brilho neon discreto;
- scanline/CRT overlay leve;
- cards em painéis escuros;
- labels técnicas com tipografia mono;
- blocos sticky de status ou contexto;
- hero com duas colunas em desktop;
- responsividade preservando hierarquia.

### 15.3 Não fazer

- não usar layout branco/genérico de template jurídico;
- não usar aparência de plugin externo sem integração visual;
- não quebrar a consistência cromática do projeto;
- não criar visual excessivamente burocrático.

---

## 16. Layout específico do banner e modal

### 16.1 Banner inicial

O banner deve parecer parte do produto e não um alerta improvisado.

#### Características desejadas

- painel escuro com borda sutil;
- títulos fortes;
- texto curto e legível;
- botões bem definidos;
- visual compatível com o design system já existente;
- bom comportamento em mobile.

### 16.2 Modal de preferências

#### Características desejadas

- card/modal grande com boa leitura;
- cabeçalho com título + explicação curta;
- lista de categorias em cards ou linhas organizadas;
- toggles bem visíveis;
- botão principal de salvar;
- ações rápidas de aceitar/rejeitar opcionais.

---

## 17. Layout específico da página `/privacidade`

### 17.1 Estrutura visual recomendada

#### Bloco 1 — barra/contexto superior
Inspirar-se nas páginas institucionais já existentes:

- faixa de status ou resumo;
- pequenos indicadores do tipo “Privacidade”, “Cookies”, “Solicitações LGPD”.

#### Bloco 2 — hero
Hero em duas colunas no desktop:

**Coluna esquerda**
- headline forte;
- texto introdutório;
- badges/pills com pontos-chave.

**Coluna direita**
- card estilo terminal/painel;
- resumo estruturado da política ou dos pilares de privacidade.

#### Bloco 3 — seções informativas
Usar cards/painéis para:

- dados tratados;
- finalidades;
- terceiros;
- cookies;
- direitos do titular.

#### Bloco 4 — formulário LGPD
Área de destaque com visual próprio, mas coerente com o restante do layout.

#### Bloco 5 — CTA/rodapé da política
Fechamento com:

- data da última atualização;
- link para gerenciar cookies;
- canal de contato.

---

## 18. Requisitos de conteúdo textual

### 18.1 Tom de voz

O conteúdo deve ser:

- claro;
- direto;
- confiável;
- objetivo;
- em português do Brasil;
- sem juridiquês desnecessário.

### 18.2 Regras de redação

- evitar copiar textos prontos de CMP externa;
- evitar mencionar tecnologias não usadas;
- evitar afirmar coleta de dados que o sistema não trata;
- descrever apenas o que é consistente com o projeto real.

---

## 19. Sugestão de organização de arquivos

O Codex pode adaptar conforme a estrutura do projeto, mas deve buscar algo próximo de:

```txt
src/
  components/
    privacy/
      CookieConsentBanner.jsx
      CookiePreferencesModal.jsx
      CookieCategoryRow.jsx
      PrivacyHero.jsx
      PrivacyDataSection.jsx
      PrivacyRightsSection.jsx
      PrivacyRequestForm.jsx
  pages/
    Privacidade.jsx
  lib/
    consent-storage.js
    analytics-loader.js
    privacy-content.js
```

Se o projeto usar outra organização, manter a separação lógica entre:

- UI
- conteúdo textual
- persistência
- integração de analytics

---

## 20. Fluxos funcionais obrigatórios

### Fluxo 1 — primeiro acesso sem consentimento salvo

1. usuário entra no site;
2. banner é exibido;
3. GA não carrega;
4. usuário escolhe aceitar, rejeitar ou configurar.

### Fluxo 2 — aceitar opcionais

1. usuário aceita opcionais;
2. preferência é salva;
3. banner some;
4. GA pode ser carregado.

### Fluxo 3 — rejeitar opcionais

1. usuário rejeita opcionais;
2. preferência é salva;
3. banner some;
4. GA continua desativado.

### Fluxo 4 — configurar granularmente

1. usuário abre configurações;
2. altera categorias opcionais;
3. salva preferências;
4. estado é persistido;
5. integrações opcionais respeitam a escolha.

### Fluxo 5 — revisar política

1. usuário acessa `/privacidade`;
2. entende dados, finalidades, terceiros e direitos;
3. pode abrir o formulário de solicitação.

### Fluxo 6 — enviar solicitação LGPD

1. usuário preenche formulário;
2. sistema valida;
3. sistema envia/persiste solicitação;
4. feedback visível de sucesso ou erro.

---

## 21. Critérios de aceitação

A entrega só pode ser considerada concluída se:

### Consentimento
- houver banner inicial em português;
- existir botão de configuração;
- existir rejeição de opcionais;
- a escolha ficar salva em `localStorage`;
- o GA não carregar antes do consentimento.

### Página de privacidade
- existir rota pública funcional;
- a página tiver política de privacidade;
- a página tiver política de cookies;
- a página mencionar Supabase, Google Analytics e YouTube embed;
- a página tiver formulário de solicitação do titular.

### Layout
- o visual estiver alinhado com `sobre.jsx` e `treinamentos.jsx`;
- a solução parecer parte nativa do projeto;
- a responsividade estiver aceitável.

### Governança mínima
- inventário mínimo refletido no conteúdo;
- categorias de consentimento coerentes;
- estrutura pronta para futura evolução.

---

## 22. Requisitos de qualidade de código

- componentes pequenos e reutilizáveis;
- sem duplicação desnecessária;
- textos centralizados quando possível;
- nomes claros;
- estado previsível;
- evitar side effects soltos;
- carregamento do GA encapsulado;
- lógica de consentimento desacoplada do layout.

---

## 23. Restrições importantes para o Codex

1. Não usar soluções visuais que descaracterizem o projeto.
2. Não inventar terceiros inexistentes.
3. Não ligar analytics por padrão.
4. Não criar categorias de cookies sem uso real.
5. Não transformar a página em texto jurídico monolítico difícil de ler.
6. Não remover a coerência com `sobre.jsx` e `treinamentos.jsx`.
7. Não presumir reCAPTCHA, mapa ou marketing trackers se isso não existe.

---

## 24. Resultado esperado

Ao final, o projeto deve possuir:

- um sistema de consentimento de cookies visualmente integrado ao produto;
- uma página `/privacidade` robusta, clara e útil;
- uma base mínima e consistente de conformidade LGPD para a realidade atual do sistema;
- uma implementação pronta para evoluções futuras sem retrabalho estrutural grande.

---

## 25. Instrução final para execução

Executar este pacote como uma única iniciativa coesa, garantindo alinhamento entre:

- conteúdo legal-operacional;
- experiência do usuário;
- identidade visual do projeto;
- comportamento técnico real das integrações.

A prioridade é entregar uma solução:

- funcional;
- clara;
- bonita;
- coerente com o sistema;
- tecnicamente correta para o escopo atual.
