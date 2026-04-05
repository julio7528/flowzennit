# LGPD - Governança mínima inicial

## Versão

- Política e consentimento: `1.0`
- Última revisão textual: `05 de abril de 2026`

## Inventário mínimo de dados

- Dados de conta: nome, e-mail e identificadores de autenticação/perfil
- Dados cadastrados pelo próprio usuário na plataforma
- Dados técnicos de consentimento e cookies/tecnologias semelhantes

## Terceiros considerados

- Supabase: backend, autenticação e armazenamento
- Google Analytics: medição opcional sob consentimento
- YouTube embed: mídia incorporada quando houver conteúdo embarcado

## Categorias de cookies vigentes

- Necessários: sempre ativos
- Medição e analytics: opcional, desligado por padrão

## Artefatos implementados

- Rota pública: `/privacidade`
- Chave de consentimento local: `flowzenit_cookie_consent`
- Persistência do formulário LGPD: tabela `public.privacy_requests`
- Governança de conteúdo centralizada em `src/lib/privacy-content.js`

## Evoluções previstas

- Versionamento mais detalhado da política
- Persistência de consentimento também no backend
- Trilha de auditoria de alterações de preferência
- Rotinas futuras de retenção/anonimização
