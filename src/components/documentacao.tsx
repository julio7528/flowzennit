import Header from './header.jsx'
import Footer from './footer.jsx'
import png001 from '../assets/png001.png'
import png002 from '../assets/png002.png'
import pngcadcat003 from '../assets/pngcadcat003.png'
import pngkanb006 from '../assets/pngkanb006.png'
import pngstuff007 from '../assets/pngstuff007.png'
import pngpainel008 from '../assets/pngpainel008.png'
import pngsub009 from '../assets/pngsub009.png'
import pngcadpart004 from '../assets/pngcadpart004.png'
import pngcadtar005 from '../assets/pngcadtar005.png'
import png010proj from '../assets/png010proj.png'

const methodologyItems = [
  {
    title: 'GTD',
    summary: 'Organiza a captura e a execucao das demandas para transformar entradas soltas em acoes objetivas.',
    usage: 'A logica do projeto separa capturas, backlog, fluxo operacional e caixas auxiliares para manter a visao clara.',
  },
  {
    title: 'GUT',
    summary: 'Prioriza itens com base em gravidade, urgencia e tendencia.',
    usage: 'A priorizacao aparece nas telas analiticas e operacionais para destacar riscos e apoiar decisao.',
  },
  {
    title: 'MASP',
    summary: 'Estrutura a resolucao de problemas em etapas de identificacao, analise, acao e padronizacao.',
    usage: 'O Kanban e os reports refletem uma trilha de evolucao que ajuda a sair do problema ate o registro final.',
  },
  {
    title: 'PDCA',
    summary: 'Mantem a melhoria continua em ciclos de planejar, executar, verificar e agir.',
    usage: 'A distribuicao das macroetapas no fluxo reforca acompanhamento, validacao e consolidacao do conhecimento.',
  },
]

const pageSections = [
  {
    title: 'AreaLogadaLayout',
    objective: 'Estrutura principal da area autenticada.',
    features: [
      'Sidebar com acesso aos modulos de dashboard, projetos, tarefas, kanban e boxes.',
      'Cabecalho com breadcrumb, indicadores do workspace, notificacoes e atualizacao manual.',
      'Modal global para cadastro rapido de novos itens a partir de qualquer tela.',
    ],
    imageLabel: 'INSERIR IMAGEM 01 - Visao geral do layout autenticado',
    image: png002,
  },
  {
    title: 'DashboardHome',
    objective: 'Painel executivo com leitura consolidada do workspace.',
    features: [
      'Indicadores de volume ativo, risco GUT, planejamento, portfolio e progresso.',
      'Cards de analise quantitativa e qualitativa para leitura rapida do cenario.',
      'Blocos de projetos em operacao, operacao corrente, radar GUT, capacidade e ultimos movimentos.',
    ],
    imageLabel: 'INSERIR IMAGEM 02 - Dashboard principal',
    image: pngpainel008,
  },
  {
    title: 'CadCategorias',
    objective: 'Cadastro e manutencao das categorias do sistema.',
    features: [
      'Criacao, edicao e exclusao de categorias.',
      'Associacao de cor para identificacao visual.',
      'Listagem ordenada com feedback visual para operacoes de salvamento e exclusao.',
    ],
    imageLabel: 'INSERIR IMAGEM 03 - Cadastro de categorias',
    image: pngcadcat003,
  },
  {
    title: 'CadSubcategoria',
    objective: 'Cadastro de subcategorias vinculadas a categorias.',
    features: [
      'Criacao e edicao de subcategorias com vinculo direto a uma categoria existente.',
      'Modal para cadastrar categoria sem sair da tela.',
      'Listagem com relacionamento entre categoria pai e subcategoria.',
    ],
    imageLabel: 'INSERIR IMAGEM 04 - Cadastro de subcategorias',
    image: pngsub009,
  },
  {
    title: 'CadParticipantes',
    objective: 'Gestao dos participantes responsaveis pelas atividades.',
    features: [
      'Cadastro, edicao e remocao de participantes.',
      'Upload de imagem com conversao para base64 e preview imediato.',
      'Lista de participantes para apoio a atribuicao de ownership nas demais telas.',
    ],
    imageLabel: 'INSERIR IMAGEM 05 - Cadastro de participantes',
    image: pngcadpart004,
  },
  {
    title: 'Tarefas',
    objective: 'Visao tabular das atividades operacionais em backlog.',
    features: [
      'Filtros por alocacao, participante, categoria e intervalo de datas.',
      'Ordenacao por nome, participante, categoria, datas e GUT dinamico.',
      'Acoes de edicao e exclusao com leitura resumida para desktop e mobile.',
    ],
    imageLabel: 'INSERIR IMAGEM 06 - Tela de tarefas',
    image: pngcadtar005,
  },
  {
    title: 'Reports',
    objective: 'Kanban analitico e operacional com foco em consistencia do fluxo.',
    features: [
      'Macrocolunas alinhadas a backlog, plan, do, check, act e done.',
      'Movimentacao de cards entre estados com regras de transicao e modal de definicao.',
      'Auditoria de consistencia, distribuicao por macrocoluna e filtros por estado e busca textual.',
    ],
    imageLabel: 'INSERIR IMAGEM 07 - Kanban e auditoria de reports',
    image: pngkanb006,
  },
  {
    title: 'Projetos',
    objective: 'Modulo de projetos com hierarquia de produto e execucao.',
    features: [
      'Estrutura Epic > Feature > User Story > Task/Bug.',
      'Abas para backlog, Gantt e Kanban de projetos.',
      'Metricas, visao hierarquica, proximas entregas e cadastro rapido de artefatos do portfolio.',
    ],
    imageLabel: 'INSERIR IMAGEM 08 - Modulo de projetos',
    image: png010proj,
  },
  {
    title: 'Stuff',
    objective: 'Boxes auxiliares para itens fora do fluxo principal.',
    features: [
      'Separacao entre Stuff, Trash, Algum dia / Talvez e Referencia futura.',
      'Recuperacao rapida de itens via acao de ativacao.',
      'Remocao de registros sem poluir o fluxo operacional principal.',
    ],
    imageLabel: 'INSERIR IMAGEM 09 - Boxes auxiliares',
    image: pngstuff007,
  },
]

const imagePlaceholderClass =
  'border border-dashed border-sky-400/25 bg-sky-950/20 p-6 text-center'

const Documentacao = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]">

        {/* ── HERO ── */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
            Documentacao do Projeto
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Guia funcional da plataforma FlowZenit
          </h1>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-sky-500/40 via-white/10 to-transparent" />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Esta pagina resume a metodologia aplicada no sistema, a arquitetura funcional da area logada e o papel de cada modulo principal.
            Os blocos sinalizados com placeholders foram deixados para voce inserir capturas de tela depois.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <img src={png001} alt="Capa da Documentação" className="w-full h-auto object-cover" />
          </div>
        </section>

        {/* ── METODOLOGIA ── */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/8 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Metodologia</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">Base conceitual do projeto</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-400 lg:block">
              O sistema combina organizacao pessoal, priorizacao e melhoria continua para controlar backlog, operacao e portfolio.
            </p>
          </div>

          <div className="grid divide-y divide-white/6 md:grid-cols-2 md:divide-x md:divide-y-0">
            {methodologyItems.map((item, i) => (
              <article key={item.title} className={`py-6 ${i % 2 === 1 ? 'md:pl-8' : 'md:pr-8'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black tracking-tighter text-sky-400">{item.title}</span>
                  <span className="h-px flex-1 bg-white/8" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">No projeto</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.usage}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── FUNCIONALIDADES POR PAGINA ── */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Area Logada</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">Funcionalidades por pagina</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Documentacao funcional dos componentes de{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-300">src/components/arealogada</code>.
            </p>
          </div>

          <div className="mt-10 flex flex-col">
            {pageSections.map((section, index) => (
              <article
                key={section.title}
                className="grid gap-8 border-t border-white/8 py-10 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="select-none text-4xl font-black tabular-nums text-sky-500/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">{section.title}</p>
                      <h3 className="mt-0.5 text-xl font-semibold text-white">{section.objective}</h3>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 pl-14">
                    {section.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-400">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {section.image ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-lg flex items-center justify-center">
                    <img src={section.image} alt={section.title} className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className={imagePlaceholderClass}>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">Placeholder</p>
                    <p className="mt-2 text-sm font-semibold text-slate-300">{section.imageLabel}</p>
                    <p className="mt-1 text-xs text-slate-500">Substitua por captura da tela correspondente.</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ── RODAPE DA DOC ── */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-4">
          <div className="h-px w-full bg-gradient-to-r from-sky-500/30 via-white/8 to-transparent" />
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Arquitetura funcional</p>
              <h2 className="mt-2 text-xl font-bold text-white">Pilares do sistema</h2>
              <ul className="mt-5 space-y-3">
                {[
                  'Autenticacao e persistencia com Supabase.',
                  'Navegacao protegida com React Router e layout compartilhado na area logada.',
                  'Interface orientada a indicadores, listas operacionais, fluxo Kanban e portfolio de projetos.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Evidencias futuras</p>
              <h2 className="mt-2 text-xl font-bold text-white">Sugestao de anexos</h2>
              <ul className="mt-5 space-y-3">
                {[
                  'Fluxo completo do usuario autenticado: dashboard, projetos, tarefas e kanban.',
                  'Capturas comparativas dos cadastros para demonstrar consistencia visual do design system.',
                  'Evidencias de uso das metodologias nas telas analiticas e operacionais.',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Documentacao