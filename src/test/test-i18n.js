import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  'pt-BR': {
    translation: {
      brand: {
        logoAlt: 'Logo da FlowZenit',
        minimalLogoAlt: 'Logo minimalista da FlowZenit',
      },
      common: {
        close: 'Fechar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        search: 'Buscar...',
        refresh: 'Atualizar',
        user: 'Usuário',
      },
      languageSwitcher: {
        aria: 'Selecionar idioma da aplicação',
        options: {
          'pt-BR': { label: 'Alterar idioma para português do Brasil' },
          en: { label: 'Alterar idioma para inglês' },
        },
      },
      nav: {
        features: 'Funcionalidades',
        methodology: 'Metodologia',
        science: 'Ciência',
        blog: 'Blog',
        about: 'Sobre',
        openMenu: 'Abrir menu',
        closeMenu: 'Fechar menu',
      },
      auth: {
        accessAccount: 'Acesse sua conta',
        startFree: 'Começar gratuitamente',
        loading: 'Carregando...',
        validatingAccess: 'Validando acesso...',
        processingAuthentication: 'Processando autenticação...',
      },
      banner: {
        message: 'Cursos e treinamentos personalizados online. Fale com nossa equipe de suporte',
        link: 'aqui',
      },
      hero: {
        eyebrow: 'O motor definitivo de produtividade',
        titleLine1: 'Domine o caos.',
        titleLine2: 'Escale a',
        titleAccent: 'execução.',
        description:
          'Um sistema que orquestra suas demandas com <strong>GTD</strong>, prioriza com <strong>GUT</strong> e resolve problemas usando <strong>MASP</strong> dentro de um ciclo <strong>PDCA</strong> contínuo.',
        primaryAction: 'Iniciar sistema integrado',
        diagram: {
          demands: 'DEMANDAS',
          organization: 'ORGANIZAÇÃO',
          prioritizes: 'PRIORIZA',
          pdcaCycle: 'CICLO PDCA',
        },
      },
      featureStrip: {
        learnMore: 'Clique para saber mais',
        items: {
          opensource: {
            shortTitle: 'OPEN SOURCE',
            title: 'Código 100% aberto',
            description: 'Transparência total.',
          },
          methodology: {
            shortTitle: 'METODOLOGIAS',
            title: 'Agile e Scrum pragmático',
            description: 'Princípios pragmáticos.',
          },
          ai: {
            shortTitle: 'IA INTEGRADA',
            title: 'Inteligência auxiliar',
            description: 'Organiza o caos inicial.',
          },
          interface: {
            shortTitle: 'INTERFACE INTUITIVA',
            title: 'Design cognitivo',
            description: 'Reduz a carga cognitiva.',
          },
        },
      },
      mainFeatures: {
        eyebrow: 'Stack tecnológico',
        titlePrefix: 'Funcionalidades de',
        titleAccent: 'alta performance',
        description: 'Ferramentas poderosas escondidas sob uma interface minimalista.',
        items: {
          prioritization: { title: 'Priorização algorítmica', description: 'Sugere o que deve ser feito agora.', tag: 'Matriz GUT' },
          pdca: { title: 'Ciclo PDCA contínuo', description: 'Melhoria contínua.', tag: 'Melhoria contínua' },
          copilot: { title: 'Copiloto neural', description: 'Evita burnout.', tag: 'Powered by AI' },
          analytics: { title: 'Deep analytics', description: 'Métricas de fluxo.', tag: 'Tempo real' },
          gitops: { title: 'Workflow GitOps', description: 'Commits vinculados a tarefas.', tag: 'GitHub · GitLab' },
          security: { title: 'Segurança militar', description: 'Criptografia ponta a ponta.', tag: 'Criptografia ponta a ponta' },
        },
      },
      newFeatures: {
        title: 'Novas funcionalidades',
        cards: {
          calendar: {
            title: 'Integração Google Calendar',
            description: 'Sincronize suas tarefas.',
            imageAlt: 'Interface do Google Calendar integrada à FlowZenit',
          },
          whatsapp: {
            title: 'Integração WhatsApp',
            description: 'Capture tarefas via áudio.',
            imageAlt: 'Interface do WhatsApp integrada à FlowZenit',
          },
        },
      },
      contacts: {
        title: 'Fale conosco',
        description: 'Dúvidas sobre o plano Enterprise? Envie uma mensagem.',
        fields: {
          name: { label: 'Nome completo', placeholder: 'Seu nome' },
          email: { label: 'E-mail corporativo', placeholder: 'voce@empresa.com' },
          message: { label: 'Mensagem', placeholder: 'Como podemos ajudar?' },
        },
        validation: {
          required: 'Este campo é obrigatório.',
          invalidEmail: 'E-mail corporativo inválido.',
        },
        feedback: {
          success: 'Mensagem enviada com sucesso. Agradecemos o contato.',
          errorGeneric: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.',
          errorWithReason: 'Não foi possível enviar sua mensagem: {{reason}}',
        },
        actions: {
          processing: 'Processando...',
          sent: 'Enviado',
          submit: 'Enviar mensagem',
        },
        modal: {
          title: 'Confirmação de envio',
          description: 'Tem certeza de que deseja enviar os dados? Esta ação não poderá ser desfeita.',
        },
      },
      cta: {
        title: 'estamos apenas começando.',
        description: 'Junte-se à nossa comunidade.',
        primary: 'Criar conta gratuita',
        secondary: 'Ler documentação',
        community: 'Entrar na comunidade',
      },
      footer: {
        description: 'Plataforma open source.',
        product: { title: 'Produto', features: 'Funcionalidades', integrations: 'Integrações', changelog: 'Changelog' },
        learn: { title: 'Aprender', documentation: 'Documentação', training: 'Treinamentos', apiGuide: 'Guia API', community: 'Comunidade', blog: 'Blog' },
        legal: { title: 'Legal', privacy: 'Privacidade e cookies', requests: 'Solicitações LGPD', manageCookies: 'Gerenciar cookies' },
        copyright: '© 2026 FlowZenit. Open source sob licença MIT.',
      },
      cookieConsent: {
        banner: {
          eyebrow: 'Privacidade e cookies',
          title: 'Você decide se a medição da plataforma pode ser ativada.',
          description: 'Utilizamos cookies e tecnologias semelhantes.',
          link: 'Ler política de privacidade e cookies',
        },
        modal: {
          eyebrow: 'Preferências de cookies',
          title: 'Configure o que pode ser ativado na sua navegação.',
          description: 'Os cookies necessários ficam sempre ativos.',
          closeAria: 'Fechar preferências de cookies',
          privacyByDefault: 'Privacidade por padrão',
          localStorageNotice: 'Esta preferência é salva localmente.',
          statusLine: 'Necessários ativos • Analytics {{analytics}}',
          authorized: 'autorizado',
          blocked: 'bloqueado',
        },
        actions: {
          accept: 'Aceitar opcionais',
          reject: 'Rejeitar opcionais',
          configure: 'Configurar preferências',
          save: 'Salvar preferências',
        },
        category: {
          alwaysOn: 'Sempre ativo',
          active: 'Ativo',
          blocked: 'Bloqueado',
        },
      },
      privacy: {
        requestTypes: [
          { value: 'confirm_processing', label: 'Confirmar tratamento de dados' },
          { value: 'access_data', label: 'Solicitar acesso aos dados' },
          { value: 'correct_data', label: 'Solicitar correção de dados' },
          { value: 'delete_data', label: 'Solicitar exclusão de dados' },
          { value: 'privacy_information', label: 'Solicitar informações sobre o tratamento' },
          { value: 'revoke_cookie_consent', label: 'Revogar consentimento de cookies opcionais' },
        ],
        form: {
          eyebrow: 'Solicitações LGPD',
          title: 'Canal atual de privacidade da plataforma.',
          description: 'Este formulário é o canal oficial para pedidos ligados à LGPD.',
          scopeTitle: 'Escopo do atendimento',
          scopeItems: [
            'Dados de conta e autenticação.',
            'Registros inseridos pelo próprio usuário na plataforma.',
            'Informações sobre tratamento, correção, acesso e exclusão.',
          ],
          immediateControlTitle: 'Controle imediato',
          immediateControlDescription: 'Ajuste sua preferência diretamente agora.',
          fields: {
            name: 'Nome',
            email: 'E-mail',
            requestType: 'Tipo de solicitação',
            details: 'Detalhes',
          },
          placeholders: {
            name: 'Seu nome',
            email: 'voce@empresa.com',
            details: 'Explique o contexto da solicitação para agilizar a análise.',
            cookieDetails: 'Descreva se deseja revogar apenas analytics.',
          },
          genericRequest: 'Solicitação',
          confirmDeletionLabel: 'Confirmo que desejo registrar um pedido de exclusão de dados.',
          validation: {
            nameRequired: 'Informe seu nome.',
            emailInvalid: 'Informe um e-mail válido.',
            requestTypeInvalid: 'Selecione um tipo de solicitação válido.',
            messageMin: 'Descreva sua solicitação com pelo menos 12 caracteres.',
            messageMax: 'Limite de 4000 caracteres excedido.',
            deletionConfirmation: 'Confirme que deseja solicitar a exclusão antes de enviar.',
          },
          errors: {
            supabaseUnavailable: 'Configuração do Supabase indisponível.',
            fallbackTooLong: 'Detalhe da solicitação excede o limite suportado no canal de fallback atual.',
          },
          feedback: {
            success: 'Solicitação enviada com sucesso. Nossa equipe analisará o pedido e retornará pelo e-mail informado.',
            error: 'Não foi possível registrar sua solicitação agora.',
            errorWithReason: 'Não foi possível registrar sua solicitação agora: {{reason}}',
          },
          fallbackHeader: '[LGPD] Solicitação recebida pela página de privacidade',
          fallbackSelectedType: 'Tipo selecionado: {{requestLabel}}',
          fallbackInternalCode: 'Código interno: {{requestType}}',
          fallbackDeletionConfirmation: 'Confirmação de exclusão: sim',
          actions: {
            submit: 'Enviar solicitação',
            sending: 'Enviando solicitação...',
          },
        },
      },
      dashboard: {
        sidebar: {
          workspace: 'Workspace',
          boxes: 'Boxes',
          records: 'Cadastros',
          items: {
            dashboard: 'Dashboard',
            projects: 'Projetos',
            tasks: 'Tarefas',
            kanban: 'Kanban',
            categories: 'Categorias',
            subcategories: 'Subcategorias',
            participants: 'Participantes',
            stuff: 'Stuff',
            trash: 'Trash',
            someday: 'Algum dia / talvez',
            reference: 'Referência futura',
          },
        },
        headerMetrics: { active: 'Ativos', alerts: 'Alertas', portfolio: 'Portfólio' },
        actions: {
          newItem: 'Novo item',
          refreshIndicators: 'Atualizar indicadores',
          blogAdmin: 'Blog Admin',
          openSidebar: 'Abrir sidebar',
          closeSidebar: 'Fechar sidebar',
          expandSidebar: 'Expandir sidebar',
          minimizeSidebar: 'Minimizar sidebar',
          notifications: 'Notificações',
        },
      },
      routes: {
        dashboard: 'Dashboard',
      },
    },
  },
}

export const testI18n = i18next.createInstance()

testI18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
})

export default testI18n
