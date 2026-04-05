import {
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  KanbanSquare,
  Lightbulb,
  MonitorPlay,
  PlayCircle,
  Route,
  Target,
  Users,
  Terminal,
  Cpu,
  Zap,
  Brain,
  GitBranch,
  Layers,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'

const pillars = [
  {
    title: 'Metodo antes do clique',
    description:
      'A plataforma organiza a operacao, mas os melhores resultados surgem quando o usuario entende a logica por tras das decisoes, prioridades e rotinas.',
    icon: Brain,
    color: '#00F0FF',
  },
  {
    title: 'Teoria aplicada no sistema',
    description:
      'Cada treinamento conecta conceito, tela e acao pratica para reduzir erro, acelerar execucao e melhorar a adocao da equipe.',
    icon: Layers,
    color: '#BD00FF',
  },
  {
    title: 'Capacitacao continua',
    description:
      'A aprendizagem estruturada ajuda a padronizar processos, elevar produtividade e sustentar melhoria continua ao longo do uso da plataforma.',
    icon: RefreshCw,
    color: '#00FF41',
  },
]

const modules = [
  {
    id: '01',
    title: 'Modulo Ciencia',
    badge: 'Base metodologica',
    color: '#00F0FF',
    objective:
      'Apresentar os fundamentos conceituais que sustentam analise, priorizacao e melhoria continua.',
    relation:
      'Traduz o raciocinio por tras de tarefas, projetos, prioridades e ciclos de evolucao refletidos na plataforma.',
    items: [
      'Matriz UT para definir prioridades com criterio.',
      'GTD para capturar, organizar e executar com clareza.',
      'Galley de Fingstone para estruturar analise e orientacao.',
      'PDCA para guiar melhoria continua no uso do sistema.',
      'MASP para investigar causas e corrigir problemas com metodo.',
    ],
  },
  {
    id: '02',
    title: 'Modulo Funcionalidades',
    badge: 'Operacao no sistema',
    color: '#BD00FF',
    objective:
      'Apresentar os recursos operacionais e mostrar como cada funcionalidade apoia a execucao diaria.',
    relation:
      'Mostra como planejamento, acompanhamento, registro e entrega saem da teoria e viram rotina dentro da plataforma.',
    items: [
      'Agendador de tarefas para compromissos, recorrencias e acompanhamento.',
      'Tipos de cadastro para sustentar fluxos com padronizacao de dados.',
      'Paineis Kanban para visualizacao de status, etapas e progresso.',
      'Gerenciamento de projeto para organizar responsaveis, prioridades e entregas.',
    ],
  },
  {
    id: '03',
    title: 'Modulo Fluxo de Metodologia',
    badge: 'Conexao entre teoria e pratica',
    color: '#00FF41',
    objective:
      'Demonstrar como teoria, processo e funcionalidade participam do mesmo fluxo operacional.',
    relation:
      'Explica como demandas entram, sao organizadas, acompanhadas, executadas, verificadas e melhoradas dentro da plataforma.',
    items: [
      'Relacao entre metodologia e funcionalidade no dia a dia.',
      'Fluxo operacional dos componentes da entrada ate a padronizacao.',
      'Jornada do usuario em um processo guiado por metodo.',
      'Conexao entre PDCA, MASP, Kanban e gestao de tarefas.',
    ],
  },
]

const flowSteps = [
  {
    title: 'Entrada e entendimento',
    description:
      'A demanda nasce, ganha contexto e passa a ser entendida com criterio antes de virar apenas mais uma tarefa.',
    icon: Lightbulb,
    tag: 'FASE_01',
    color: '#00F0FF',
  },
  {
    title: 'Organizacao e classificacao',
    description:
      'Cadastros, tipos e regras organizam o trabalho para manter padrao, visibilidade e consistencia operacional.',
    icon: BookOpen,
    tag: 'FASE_02',
    color: '#BD00FF',
  },
  {
    title: 'Execucao acompanhada',
    description:
      'Kanban, tarefas e projetos mostram o progresso com clareza e ajudam a manter foco nas proximas acoes.',
    icon: KanbanSquare,
    tag: 'FASE_03',
    color: '#00FF41',
  },
  {
    title: 'Conferencia e melhoria',
    description:
      'Indicadores, revisoes e metodo fecham o ciclo para ajustar rota, padronizar aprendizados e melhorar continuamente.',
    icon: Target,
    tag: 'FASE_04',
    color: '#00F0FF',
  },
]

const modalities = [
  {
    title: 'Aulas ao vivo',
    description:
      'Treinamentos guiados por Google Meet com interacao direta, duvidas em tempo real e alinhamento pratico de uso.',
    icon: Users,
    color: '#00F0FF',
    tag: 'LIVE',
  },
  {
    title: 'Conteudo gravado',
    description:
      'Videos organizados em playlists no YouTube para consumo sob demanda, revisao rapida e aprendizagem no proprio ritmo.',
    icon: MonitorPlay,
    color: '#BD00FF',
    tag: 'VOD',
  },
]

const benefits = [
  'Flexibilidade para perfis diferentes de aprendizagem.',
  'Revisao de conteudo sempre que necessario.',
  'Escalabilidade para capacitar equipes inteiras.',
  'Combinacao entre teoria, processo e pratica operacional.',
  'Acompanhamento ao vivo quando o contexto exigir suporte guiado.',
]

const highlights = [
  { label: 'Trilhas estruturadas', value: '3', unit: 'modulos' },
  { label: 'Metodologias', value: '5+', unit: 'frameworks' },
  { label: 'Formatos de ensino', value: '2', unit: 'modalidades' },
]

const TrainingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white antialiased selection:bg-[#00F0FF] selection:text-black overflow-x-hidden font-[Public_Sans,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .trn-display { font-family: 'Public Sans', sans-serif; }
        .trn-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes trnShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .trn-shimmer { animation: trnShimmer 2.4s infinite; }
        .trn-shimmer-d1 { animation: trnShimmer 2.4s infinite 0.6s; }
        .trn-shimmer-d2 { animation: trnShimmer 2.4s infinite 1.2s; }

        @keyframes trnScan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .trn-scanline {
          animation: trnScan 4s linear infinite;
        }

        .trn-crt {
          background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.22) 50%),
                      linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .trn-grid {
          background-image: linear-gradient(#1a1d26 1px, transparent 1px),
                            linear-gradient(90deg, #1a1d26 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .trn-card-hover { transition: border-color 0.2s, transform 0.2s; }
        .trn-card-hover:hover { transform: translateY(-3px); }

        @media (prefers-reduced-motion: reduce) {
          .trn-shimmer, .trn-shimmer-d1, .trn-shimmer-d2, .trn-scanline { animation: none !important; }
        }
      `}</style>

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-14">

        {/* ── Status Bar ── */}
        <div className="border-b border-[#1A1D26] bg-[#050508]/90 backdrop-blur-sm sticky top-20 z-30">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]" />
              </div>
              <h2 className="trn-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">
                CURSOS &amp; TREINAMENTOS // STATUS: DISPONIVEL
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3 trn-mono text-xs text-gray-400">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1016] border border-[#1A1D26]">
                <Terminal className="h-3.5 w-3.5" />
                <span>3 MODULOS</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1016] border border-[#1A1D26]">
                <Cpu className="h-3.5 w-3.5" />
                <span>GUT + GTD + PDCA + MASP</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1016] border border-[#1A1D26]">
                <Zap className="h-3.5 w-3.5" />
                <span>LIVE + VOD</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div className="relative w-full aspect-video overflow-hidden border border-[#1A1D26] group">
                <div className="absolute inset-0 trn-grid opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/8 via-transparent to-[#BD00FF]/8" />
                {/* Scanline */}
                <div className="trn-scanline absolute left-0 right-0 h-8 bg-gradient-to-b from-[#00F0FF]/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="trn-mono text-xs text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-2 py-1 mb-4 inline-block">
                    &gt; INIT TRAINING_MODULE
                  </span>
                  <h1 className="trn-display text-4xl md:text-5xl font-black tracking-tight text-white leading-tight uppercase mt-3">
                    Conhecimento,<br />
                    metodo e<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                      resultado.
                    </span>
                  </h1>
                </div>
              </div>

              {/* Stat pills */}
              <div className="grid grid-cols-3 gap-3">
                {highlights.map((h) => (
                  <div key={h.label} className="bg-[#0E1016] border border-[#1A1D26] p-4 trn-card-hover group hover:border-[#00F0FF]/40">
                    <p className="trn-mono text-[0.6rem] text-gray-500 uppercase tracking-widest">{h.label}</p>
                    <p className="trn-display text-2xl font-black text-white mt-1">{h.value}</p>
                    <p className="trn-mono text-[0.6rem] text-[#00F0FF]">{h.unit}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href="#modulos"
                  className="flex-1 bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors trn-mono font-bold py-3 px-5 text-sm uppercase flex items-center justify-center gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  Explorar modulos
                </a>
                <Link
                  to="/login"
                  className="flex-1 bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors trn-mono font-bold py-3 px-5 text-sm uppercase flex items-center justify-center gap-2"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  Iniciar treino
                </Link>
              </div>
            </div>

            {/* Right: Journey terminal card */}
            <div className="bg-[#0E1016] border border-[#1A1D26] p-6 flex flex-col gap-0 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 opacity-5 trn-grid" />
              <div className="flex items-center gap-2 border-b border-[#1A1D26] pb-3 mb-5 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="trn-mono text-xs text-gray-500 ml-2">training_journey.log</span>
              </div>
              <div className="relative z-10 trn-mono text-xs text-gray-300 leading-relaxed mb-5">
                <span className="text-[#BD00FF]">const</span>{' '}
                <span className="text-[#00F0FF]">jornada</span> = {'{'}<br />
                {'  '}<span className="text-gray-400">objetivo:</span>{' '}
                <span className="text-[#00FF41]">'Do conceito ate a execucao'</span>,<br />
                {'  '}<span className="text-gray-400">metodologias:</span>{' '}[
                <span className="text-[#00FF41]">'GUT'</span>,{' '}
                <span className="text-[#00FF41]">'GTD'</span>,{' '}
                <span className="text-[#00FF41]">'PDCA'</span>,{' '}
                <span className="text-[#00FF41]">'MASP'</span>],<br />
                {'  '}<span className="text-gray-400">plataforma:</span>{' '}
                <span className="text-[#00FF41]">'FlowZenit'</span>,<br />
                {'  '}<span className="text-gray-400">formato:</span>{' '}
                <span className="text-[#00FF41]">'Live + VOD'</span>,<br />
                {'};'}<br />
                <br />
                <span className="text-gray-500">// Carregando trilha de capacitacao...</span><br />
                <span className="animate-pulse text-[#00F0FF]">_</span>
              </div>

              {/* Flow steps vertical */}
              <div className="relative z-10 flex flex-col gap-0 border-l border-[#1A1D26] ml-2 pl-4 flex-1">
                {flowSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={step.tag} className="relative group pb-5 last:pb-0">
                      <div
                        className="absolute -left-[21px] top-1 h-2.5 w-2.5 border transition-colors"
                        style={{
                          backgroundColor: '#050508',
                          borderColor: i === 0 ? step.color : '#333',
                          boxShadow: i === 0 ? `0 0 8px ${step.color}88` : 'none',
                        }}
                      />
                      <div className="flex items-start gap-3 p-3 hover:bg-[#1A1D26]/30 transition-colors">
                        <div
                          className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${step.color}15`, color: step.color }}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span
                            className="trn-mono text-[0.6rem] font-bold block"
                            style={{ color: step.color }}
                          >
                            [{step.tag}]
                          </span>
                          <h4 className="trn-display font-bold text-sm text-white">{step.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-5">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Pilares ── */}
        <section className="border-t border-[#1A1D26] pt-10">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-5 w-5 text-[#BD00FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Por que aprender antes de operar
            </p>
          </div>
          <h2 className="trn-display text-3xl md:text-4xl font-black text-white mb-8 max-w-2xl">
            A ferramenta sozinha nao garante resultado.
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map((p) => {
              const Icon = p.icon
              return (
                <article
                  key={p.title}
                  className="bg-[#0E1016] border border-[#1A1D26] p-6 trn-card-hover group relative overflow-hidden"
                  style={{ '--accent': p.color }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ backgroundColor: p.color, opacity: 0.5 }}
                  />
                  <div
                    className="w-9 h-9 flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${p.color}15`, color: p.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="trn-display font-bold text-white text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-6">{p.description}</p>
                  <div className="h-0.5 w-full bg-[#1A1D26] mt-5 overflow-hidden">
                    <div className="h-full w-2/3 trn-shimmer" style={{ backgroundColor: p.color }} />
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── Modules ── */}
        <section id="modulos" className="border-t border-[#1A1D26] pt-10">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-[#00F0FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Organizacao por modulos
            </p>
          </div>
          <h2 className="trn-display text-3xl md:text-4xl font-black text-white mb-8 max-w-3xl">
            Tres frentes para formar dominio real da plataforma.
          </h2>

          <div className="flex flex-col gap-5">
            {modules.map((mod) => (
              <article
                key={mod.id}
                className="bg-[#0E1016] border border-[#1A1D26] relative overflow-hidden trn-card-hover group"
                style={{ borderLeftColor: mod.color, borderLeftWidth: 3 }}
              >
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0">
                  {/* Left col */}
                  <div className="p-7 border-b lg:border-b-0 lg:border-r border-[#1A1D26]">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="trn-mono text-xs border border-[#1A1D26] px-3 py-1 text-gray-400">
                        {mod.id}
                      </span>
                      <span
                        className="trn-mono text-xs px-3 py-1 border"
                        style={{
                          color: mod.color,
                          borderColor: `${mod.color}40`,
                          backgroundColor: `${mod.color}10`,
                        }}
                      >
                        {mod.badge}
                      </span>
                    </div>
                    <h3 className="trn-display text-2xl font-black text-white mb-5">{mod.title}</h3>

                    <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-1">
                      Objetivo do aprendizado
                    </p>
                    <p className="text-sm text-gray-200 leading-6 mb-5">{mod.objective}</p>

                    <div className="bg-black/30 border border-[#1A1D26] p-4">
                      <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-1">
                        Relacao com a plataforma
                      </p>
                      <p className="text-sm text-gray-300 leading-6">{mod.relation}</p>
                    </div>
                  </div>

                  {/* Right col */}
                  <div className="p-7">
                    <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-4">
                      Topicos abordados
                    </p>
                    <div className="flex flex-col gap-3">
                      {mod.items.map((item, idx) => (
                        <div
                          key={item}
                          className="flex gap-3 border border-[#1A1D26] p-4 bg-black/20 hover:bg-[#1A1D26]/50 transition-colors"
                        >
                          <span
                            className="trn-mono text-xs shrink-0 mt-0.5 font-bold"
                            style={{ color: mod.color }}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <p className="text-sm text-gray-200 leading-6">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Metodologia flow ── */}
        <section className="border-t border-b border-[#1A1D26] py-10 relative bg-[#0E1016]/30">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-50" />
          <div className="flex items-center gap-2 mb-8 pl-4">
            <Route className="h-5 w-5 text-[#00F0FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">
              Integracao entre metodologia e sistema
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-0 relative">
            {flowSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.tag} className="flex flex-col gap-3 px-6 relative border-r border-[#1A1D26] last:border-r-0">
                  {i < flowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-6 translate-x-1/2 h-5 w-5 text-gray-600 z-10 bg-[#050508]" />
                  )}
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="trn-mono text-[0.6rem] font-bold" style={{ color: step.color }}>
                    [{step.tag}]
                  </span>
                  <h4 className="trn-display font-bold text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-5">{step.description}</p>
                  <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                    <div
                      className={`h-full ${i === 0 ? 'trn-shimmer' : i === 1 ? 'trn-shimmer-d1' : i === 2 ? 'trn-shimmer-d2' : 'trn-shimmer'}`}
                      style={{ backgroundColor: step.color, width: `${60 + i * 13}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Modalidades ── */}
        <section className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="bg-[#0E1016] border border-[#1A1D26] p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 trn-grid" />
            <div className="relative z-10">
              <p className="trn-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-2">
                Modalidades de ensino
              </p>
              <h2 className="trn-display text-2xl font-black text-white mb-4">
                Flexibilidade para aprender com suporte ou no proprio ritmo.
              </h2>
              <p className="text-sm text-gray-400 leading-6">
                A proposta combina encontros ao vivo com conteudo gravado para atender equipes em momentos diferentes de maturidade e necessidade operacional.
              </p>
            </div>
            <div className="flex flex-col gap-4 relative z-10">
              {modalities.map((m) => {
                const Icon = m.icon
                return (
                  <div key={m.title} className="border border-[#1A1D26] p-5 bg-black/20 trn-card-hover group hover:border-[#00F0FF]/30">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${m.color}15`, color: m.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="trn-display font-bold text-white">{m.title}</h3>
                          <span
                            className="trn-mono text-[0.6rem] px-2 py-0.5 border font-bold"
                            style={{ color: m.color, borderColor: `${m.color}40`, backgroundColor: `${m.color}10` }}
                          >
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-6">{m.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-[#0E1016] border border-[#1A1D26] p-8">
            <p className="trn-mono text-xs text-gray-500 uppercase tracking-widest mb-5">
              Beneficios das modalidades
            </p>
            <div className="flex flex-col gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 border border-[#1A1D26] p-4 bg-black/20 hover:bg-[#1A1D26]/40 transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 bg-[#00F0FF]/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00F0FF]" />
                  </div>
                  <p className="text-sm text-gray-200 leading-6">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-8">
          <div className="border border-[#1A1D26] bg-[#0E1016] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 trn-grid opacity-5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BD00FF] to-transparent" />
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center relative z-10">
              <div>
                <p className="trn-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3">
                  &gt; PROXIMO_PASSO
                </p>
                <h2 className="trn-display text-3xl sm:text-4xl font-black text-white mb-4">
                  O treinamento conecta metodo,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                    sistema e resultado operacional.
                  </span>
                </h2>
                <p className="text-sm text-gray-400 leading-7 max-w-xl">
                  Ao entender os conceitos e as funcionalidades em conjunto, o usuario passa a operar a plataforma com mais eficiencia, clareza e estrategia.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors trn-mono font-bold py-4 px-6 text-sm uppercase flex items-center justify-center gap-2"
                >
                  Comecar treinamento
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#modulos"
                  className="bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors trn-mono font-bold py-4 px-6 text-sm uppercase flex items-center justify-center gap-2"
                >
                  Ver modulos disponiveis
                  <BookOpen className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CRT overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 trn-crt" />

      <Footer />
    </div>
  )
}

export default TrainingPage
