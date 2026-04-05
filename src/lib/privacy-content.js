export const PRIVACY_LAST_UPDATED = '05 de abril de 2026'

export const PRIVACY_STATUS_BADGES = [
  'Privacidade por padrão',
  'Cookies opcionais sob consentimento',
  'Solicitações LGPD no próprio site',
]

export const PRIVACY_HERO_POINTS = [
  {
    label: 'Dados tratados',
    value: 'Conta, registros do usuário e preferência de consentimento',
  },
  {
    label: 'Terceiros relevantes',
    value: 'Supabase, Google Analytics e YouTube embed',
  },
  {
    label: 'Controle do titular',
    value: 'Banner, central de preferências e formulário LGPD',
  },
]

export const PRIVACY_DATA_GROUPS = [
  {
    title: 'Dados de conta',
    accent: '#00F0FF',
    description:
      'Dados básicos usados para criar, autenticar e manter a conta do usuário na FlowZenit.',
    items: ['Nome', 'E-mail', 'Identificadores necessários para autenticação e perfil'],
  },
  {
    title: 'Dados cadastrados pelo próprio usuário',
    accent: '#BD00FF',
    description:
      'Registros operacionais, cadastros internos e demais informações inseridas pelo usuário para organizar o trabalho dentro da plataforma.',
    items: ['Cadastros internos', 'Registros operacionais', 'Conteúdo criado para gestão e uso do sistema'],
  },
  {
    title: 'Dados técnicos de privacidade',
    accent: '#00FF41',
    description:
      'Informações necessárias para registrar preferências de privacidade e manter o funcionamento técnico do site.',
    items: [
      'Preferência de consentimento salva localmente no navegador',
      'Cookies e tecnologias semelhantes necessários para autenticação e funcionamento',
      'Medição de uso somente quando houver autorização para analytics',
    ],
  },
]

export const PRIVACY_PURPOSES = [
  'Criar e manter a conta do usuário.',
  'Autenticar acessos e proteger a área logada.',
  'Armazenar e organizar os registros cadastrados pelo próprio usuário.',
  'Garantir funcionamento, estabilidade e segurança básica do serviço.',
  'Registrar a escolha de privacidade do usuário.',
  'Medir o uso da plataforma para melhoria contínua apenas quando houver consentimento para analytics.',
  'Exibir conteúdos incorporados de terceiros quando o site utilizar mídias embarcadas, como YouTube.',
]

export const PRIVACY_THIRD_PARTIES = [
  {
    name: 'Supabase',
    accent: '#00F0FF',
    summary:
      'Infraestrutura de backend, autenticação e armazenamento utilizada para operar a plataforma e os dados vinculados à conta.',
  },
  {
    name: 'Google Analytics',
    accent: '#BD00FF',
    summary:
      'Ferramenta de medição e análise de uso ativada somente após consentimento explícito para a categoria de medição/analytics.',
  },
  {
    name: 'YouTube embed',
    accent: '#00FF41',
    summary:
      'Pode ser utilizado quando houver vídeos incorporados no site. Nesses casos, o carregamento do conteúdo depende da infraestrutura do YouTube.',
  },
]

export const COOKIE_CATEGORIES = [
  {
    key: 'necessary',
    title: 'Necessários',
    accent: '#00F0FF',
    alwaysOn: true,
    description:
      'Mantêm autenticação, navegação, persistência técnica básica e o registro da sua preferência de privacidade.',
  },
  {
    key: 'analytics',
    title: 'Medição e analytics',
    accent: '#BD00FF',
    alwaysOn: false,
    description:
      'Controlam o carregamento do Google Analytics para medir uso e apoiar melhorias de produto.',
  },
]

export const PRIVACY_RIGHTS = [
  'Solicitar confirmação sobre o tratamento de seus dados.',
  'Solicitar acesso aos dados pessoais tratados na plataforma.',
  'Solicitar correção de informações desatualizadas ou incompletas.',
  'Solicitar exclusão da conta e dos dados aplicáveis.',
  'Revogar o consentimento de cookies opcionais.',
  'Pedir informações adicionais sobre as finalidades e terceiros envolvidos.',
]

export const PRIVACY_RETENTION_RULES = [
  {
    title: 'Dados de conta',
    text:
      'São mantidos enquanto a conta estiver ativa ou enquanto forem necessários para autenticação, suporte ao serviço e segurança operacional.',
  },
  {
    title: 'Dados cadastrados pelo usuário',
    text:
      'Permanecem disponíveis enquanto fizerem parte do uso normal da plataforma. Em solicitações válidas de exclusão, o tratamento passa por análise e execução conforme o caso.',
  },
  {
    title: 'Consentimento e cookies',
    text:
      'A preferência de consentimento fica salva no navegador até que o usuário a altere, limpe os dados locais ou uma nova versão da política exija nova escolha.',
  },
]

export const PRIVACY_GOVERNANCE_ITEMS = [
  'Inventário inicial limitado a dados de conta, registros criados pelo usuário e dados técnicos de consentimento.',
  'Inventário inicial de terceiros limitado a Supabase, Google Analytics e YouTube embed.',
  'Consentimento persistido localmente com versionamento para futura revisão da política.',
  'Estrutura preparada para evolução futura com trilha de auditoria, retenção refinada e backend de consentimento.',
]

export const PRIVACY_REQUEST_TYPES = [
  { value: 'confirm_processing', label: 'Confirmar tratamento de dados' },
  { value: 'access_data', label: 'Solicitar acesso aos dados' },
  { value: 'correct_data', label: 'Solicitar correção de dados' },
  { value: 'delete_data', label: 'Solicitar exclusão de dados' },
  { value: 'privacy_information', label: 'Solicitar informações sobre o tratamento' },
  { value: 'revoke_cookie_consent', label: 'Revogar consentimento de cookies opcionais' },
]
