import {
  ArrowRight,
  BarChart3,
  Brain,
  Circle,
  Lightbulb,
  RefreshCw,
  TerminalSquare,
  View,
} from 'lucide-react'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Ciencia = () => {
  return (
    <div className="min-h-screen bg-[#070818] text-[#e2e8f0] antialiased selection:bg-[#ff4fd8] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
        .science-body { font-family: 'Inter Tight', sans-serif; }
        .science-display { font-family: 'Space Grotesk', sans-serif; }
        .science-mono { font-family: 'JetBrains Mono', monospace; }
        .science-grid {
          background-image:
            linear-gradient(rgba(59,225,247,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,225,247,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .science-glass {
          background: rgba(18, 11, 31, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .science-cyan-glow { text-shadow: 0 0 18px rgba(59,225,247,0.5); }
        .science-box-glow { box-shadow: 0 0 26px rgba(139,92,246,0.15); }
        .science-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
          pointer-events: none;
          opacity: 0.14;
          animation: scanShift 16s linear infinite;
        }
        .science-fade-up {
          opacity: 0;
          transform: translateY(14px);
          animation: fadeUp 760ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--d, 0ms);
        }
        .science-card-hover {
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 320ms ease, box-shadow 320ms ease;
        }
        .science-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        }
        .science-core-pulse {
          animation: corePulse 5.2s ease-in-out infinite;
        }
        .science-float {
          animation: floatY 7.2s ease-in-out infinite;
        }
        .science-float-delay {
          animation: floatY 8.6s ease-in-out infinite;
          animation-delay: -1.6s;
        }
        .science-orbit {
          animation: orbitSpin 72s linear infinite;
        }
        .science-orbit-reverse {
          animation: orbitSpinReverse 48s linear infinite;
        }
        .science-bar-anim {
          transform-origin: left center;
          animation: barGrow 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .science-radar-pulse {
          animation: radarPulse 4.6s ease-in-out infinite;
        }
        .science-dot-twinkle {
          animation: dotTwinkle 3.4s ease-in-out infinite;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes corePulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(59,225,247,0.35)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 18px rgba(59,225,247,0.65)); transform: scale(1.06); }
        }
        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes orbitSpinReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes scanShift {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes radarPulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 0.72; }
        }
        @keyframes dotTwinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .science-fade-up,
          .science-card-hover,
          .science-core-pulse,
          .science-float,
          .science-float-delay,
          .science-orbit,
          .science-orbit-reverse,
          .science-bar-anim,
          .science-radar-pulse,
          .science-dot-twinkle,
          .science-scanline {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <Header />

      <main className="science-body pt-20">
        <section className="relative flex min-h-screen w-full flex-col overflow-hidden border-b border-white/5 lg:flex-row">
          <div className="relative w-full border-r border-white/5 lg:w-[55%]">
            <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-24 md:px-12 lg:px-20">
              <section className="mb-28 min-h-[88vh] content-center">
                <div className="science-fade-up mb-6 flex items-center gap-3" style={{ '--d': '60ms' }}>
                  <div className="h-px w-12 bg-[#3be1f7]/50" />
                  <span className="science-mono text-[11px] tracking-[0.2em] text-[#3be1f7]">INIT_SEQUENCE</span>
                </div>
                <h1 className="science-display science-cyan-glow science-fade-up mb-10 text-5xl font-bold leading-[0.88] tracking-tight md:text-7xl" style={{ '--d': '130ms' }}>
                  <span className="bg-gradient-to-r from-[#3be1f7] via-white to-[#8b5cf6] bg-clip-text text-transparent">
                    A FÓRMULA
                  </span>
                  <br />
                  <span className="text-white/23">DA MENTE.</span>
                </h1>
                <div className="science-fade-up max-w-xl space-y-7 text-[17px] leading-relaxed text-[#94a3b8] md:text-[19px]" style={{ '--d': '210ms' }}>
                  <p>
                    Nós não fomos projetados para a era da informação. Nosso hardware biológico evoluiu na savana,
                    processando ameaças imediatas e recompensas tangíveis.
                  </p>
                  <p>
                    Hoje, operamos em um ambiente de <span className="font-medium text-white">inputs infinitos</span>.
                    O resultado? Ansiedade cognitiva. Loopings mentais. O sistema operacional trava.
                  </p>
                </div>
                <div className="science-glass science-box-glow science-fade-up science-card-hover relative mt-14 overflow-hidden rounded border-l-4 border-l-[#ff4fd8] p-7" style={{ '--d': '300ms' }}>
                  <p className="science-display text-2xl italic text-white">"A mente é para ter ideias, não para guardá-las."</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-px w-8 bg-[#ff4fd8]" />
                    <span className="science-mono text-[11px] uppercase text-[#ff4fd8]">David Allen // GTD Origin</span>
                  </div>
                </div>
              </section>

              <section className="min-h-screen content-center py-24">
                <span className="science-mono rounded border border-[#ff4fd8]/20 bg-[#ff4fd8]/10 px-2 py-1 text-[11px] text-[#ff4fd8]">
                  MODULE_02
                </span>
                <h2 className="science-display mb-8 mt-4 text-4xl font-bold text-white">
                  MATRIZ <span className="text-[#ff4fd8]">G.U.T.</span>
                </h2>
                <p className="mb-10 text-base leading-relaxed text-[#94a3b8] md:text-lg">
                  Como priorizar quando tudo parece urgente? A resposta não é intuição. É cálculo. A Matriz GUT
                  decompõe o caos em três vetores mensuráveis.
                </p>
                <div className="grid gap-5">
                  <article className="science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#ff4fd8]/45">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-xl text-white">Gravidade</h3>
                      <span className="science-mono text-[11px] text-[#ff4fd8]">WT: 5</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Impacto se nada for feito. Danos, prejuízos e colapso do sistema.</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-bar-anim h-full w-[80%] bg-[#ff4fd8]" />
                    </div>
                  </article>
                  <article className="science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#3be1f7]/45">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-xl text-white">Urgência</h3>
                      <span className="science-mono text-[11px] text-[#3be1f7]">WT: 4</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Tempo disponível para resolução. O prazo está expirando agora?</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-bar-anim h-full w-[60%] bg-[#3be1f7]" />
                    </div>
                  </article>
                  <article className="science-card-hover rounded border border-white/5 bg-[#120b1f] p-5 transition-colors hover:border-[#8b5cf6]/45">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="science-display text-xl text-white">Tendência</h3>
                      <span className="science-mono text-[11px] text-[#8b5cf6]">WT: 3</span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">Potencial de crescimento do problema. Vai piorar progressivamente?</p>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="science-bar-anim h-full w-[40%] bg-[#8b5cf6]" />
                    </div>
                  </article>
                </div>
              </section>

              <section className="min-h-screen content-center py-24">
                <span className="science-mono rounded border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-2 py-1 text-[11px] text-[#8b5cf6]">
                  MODULE_03
                </span>
                <h2 className="science-display mb-8 mt-4 text-4xl font-bold text-white">
                  FLUXO <span className="text-[#8b5cf6]">MENTAL</span>
                </h2>
                <div className="space-y-6 text-base leading-relaxed text-[#94a3b8] md:text-lg">
                  <p>
                    <strong className="text-white">Getting Things Done (GTD)</strong> não é sobre fazer mais. É sobre o
                    estado de “Mind Like Water”. Uma reação proporcional a cada input.
                  </p>
                  <p>
                    O segredo está na captura externa. Quando você confia no sistema, seu cérebro deixa de gastar RAM
                    tentando lembrar pendências e passa a processar estratégia.
                  </p>
                </div>
                <div className="science-glass mt-11 border-l-4 border-l-[#3be1f7] p-6">
                  <h4 className="science-mono mb-4 text-sm text-[#3be1f7]">CORE_ALGORITHM:</h4>
                  <ul className="science-mono space-y-3 text-xs text-[#94a3b8] md:text-sm">
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">01.</span><span>CAPTURE: Esvazie a mente.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">02.</span><span>CLARIFY: É acionável? (Y/N)</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">03.</span><span>ORGANIZE: Coloque no lugar certo.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">04.</span><span>REFLECT: Revisão semanal.</span></li>
                    <li className="flex gap-3"><span className="text-[#8b5cf6]">05.</span><span className="text-white">ENGAGE: Execute.</span></li>
                  </ul>
                </div>
              </section>

              <section className="min-h-[80vh] content-center py-24">
                <span className="science-mono rounded border border-[#3be1f7]/20 bg-[#3be1f7]/10 px-2 py-1 text-[11px] text-[#3be1f7]">
                  MODULE_04
                </span>
                <h2 className="science-display mb-8 mt-4 text-4xl font-bold text-white">
                  VISIBILIDADE <span className="text-[#3be1f7]">TOTAL</span>
                </h2>
                <div className="space-y-6 text-base leading-relaxed text-[#94a3b8] md:text-lg">
                  <p>
                    O cérebro humano processa imagens muito mais rápido que texto. O Kanban transforma trabalho
                    abstrato em objetos visuais que se movem no espaço.
                  </p>
                  <p>
                    Limitar <span className="text-[#3be1f7]">WIP (Work In Progress)</span> é a única forma de evitar
                    gargalos. Se tudo é prioridade, nada é prioridade.
                  </p>
                </div>
              </section>
            </div>
          </div>

          <aside className="science-grid relative hidden h-screen overflow-hidden border-l border-white/5 lg:sticky lg:top-0 lg:flex lg:w-[45%] lg:items-center lg:justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,27,46,0.85),#0b0b16)]" />
            <div className="relative z-10 h-[420px] w-[420px]">
              <div className="science-orbit absolute inset-0 rounded-full border border-[#3be1f7]/10" />
              <div className="science-orbit-reverse absolute left-[15%] top-[15%] h-[70%] w-[70%] rounded-full border border-dashed border-[#ff4fd8]/20" />
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3be1f7]/35 bg-[#120b1f] shadow-[0_0_50px_rgba(59,225,247,0.2)]">
                <div className="flex h-full items-center justify-center">
                  <Brain className="science-core-pulse h-12 w-12 text-[#3be1f7]" />
                </div>
              </div>
              <span className="science-dot-twinkle absolute left-1/2 top-[8%] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ff4fd8] shadow-[0_0_10px_#ff4fd8]" />
              <span className="science-dot-twinkle absolute bottom-[22%] right-[13%] h-3 w-3 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]" />
              <span className="science-dot-twinkle absolute left-[14%] top-1/2 h-2 w-2 rounded-full bg-white" />

              <div className="science-glass science-float absolute -right-10 top-[19%] w-44 rounded p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="science-mono text-[10px] text-[#ff4fd8]">G.U.T. INDEX</span>
                  <BarChart3 className="h-3 w-3 text-[#ff4fd8]" />
                </div>
                <div className="flex h-12 items-end gap-1">
                  <div className="h-[80%] w-1/3 rounded-t-sm bg-[#ff4fd8]/55" />
                  <div className="h-[40%] w-1/3 rounded-t-sm bg-[#3be1f7]/55" />
                  <div className="h-[60%] w-1/3 rounded-t-sm bg-[#8b5cf6]/55" />
                </div>
              </div>

              <div className="science-glass science-float-delay absolute -left-8 bottom-[18%] w-36 rounded p-3 opacity-80">
                <div className="mb-2 flex items-center justify-between">
                  <span className="science-mono text-[10px] text-[#3be1f7]">KANBAN_STATE</span>
                  <View className="h-3 w-3 text-[#3be1f7]" />
                </div>
                <div className="flex gap-1">
                  <div className="relative h-10 w-full rounded-sm border border-white/10 bg-white/5">
                    <div className="absolute left-1 right-1 top-1 h-1.5 rounded-sm bg-[#3be1f7]/40" />
                  </div>
                  <div className="h-10 w-full rounded-sm border border-white/10 bg-white/5" />
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="relative flex w-full flex-col border-b border-[#283739]/30 lg:flex-row">
          <div className="science-grid relative w-full border-r border-[#283739]/40 lg:w-[55%]">
            <div className="px-6 py-20 md:px-12 lg:px-20">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-px w-8 bg-[#3be1f7]" />
                <span className="science-mono text-[11px] tracking-wider text-[#3be1f7]">SEÇÃO 02 // ANÁLISE</span>
              </div>
              <h2 className="science-display mb-8 text-4xl font-bold leading-tight text-white md:text-6xl">
                DINÂMICA <span className="text-[#3be1f7]">COMPARATIVA</span>
              </h2>
              <div className="max-w-xl space-y-6 text-[20px] leading-relaxed text-[#94a3b8]">
                <p>
                  <span className="font-medium italic text-white">Eficiência não é monolítica.</span> É um equilíbrio
                  entre carga cognitiva e throughput.
                </p>
                <p>
                  Processamos três metodologias dominantes dentro do framework acadêmico cibernético. Os dados sugerem
                  que, enquanto <span className="text-[#ff4fd8]">sistemas visuais</span> reduzem a ansiedade imediata,
                  sistemas estruturados baseados em listas maximizam a precisão de recuperação no longo prazo.
                </p>
              </div>
            </div>

            <div className="relative px-6 pb-20 md:px-12 lg:px-20">
              <div className="science-glass overflow-hidden rounded-md border border-[#3be1f7]/20 shadow-[0_0_20px_rgba(59,225,247,0.14)]">
                <div className="px-5 pb-3 pt-5">
                  <h3 className="science-display text-3xl font-bold text-white">MÉTODOS x FOCO</h3>
                  <p className="science-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[#3be1f7]/80">
                    FEED DE DADOS AO VIVO • ANÁLISE COMPARATIVA EM TEMPO REAL
                  </p>
                </div>
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead>
                    <tr className="science-mono border-y border-white/10 bg-black/45 text-[10px] uppercase tracking-wider text-[#3be1f7]">
                      <th className="px-5 py-3">Methodology</th>
                      <th className="px-5 py-3">Focus Area</th>
                      <th className="px-5 py-3">Core Mechanic</th>
                      <th className="px-5 py-3 text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5">
                      <td className="science-display px-5 py-3 font-bold text-white">GTD</td>
                      <td className="px-5 py-3 text-[#94a3b8]">Individual</td>
                      <td className="px-5 py-3 text-[#94a3b8]">Mental Flow</td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-1 w-16 overflow-hidden rounded bg-[#1e1b2e]"><div className="science-bar-anim h-full w-[85%] bg-[#8b5cf6]" /></div>
                          <span className="science-mono text-[#8b5cf6]">0.85</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-l-2 border-[#3be1f7] bg-[#1e1b2e]/80">
                      <td className="science-display px-5 py-3 font-bold text-[#3be1f7]">KANBAN</td>
                      <td className="px-5 py-3 text-white">Visual</td>
                      <td className="px-5 py-3 text-white">Workflow</td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-1 w-16 overflow-hidden rounded bg-[#120b1f]">
                            <div className="science-bar-anim h-full w-[72%] bg-[#3be1f7] shadow-[0_0_8px_rgba(59,225,247,0.8)]" />
                          </div>
                          <span className="science-mono font-bold text-[#3be1f7]">0.72</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="transition-colors duration-200 hover:bg-white/5">
                      <td className="science-display px-5 py-3 font-bold text-white">MASP</td>
                      <td className="px-5 py-3 text-[#94a3b8]">Problem</td>
                      <td className="px-5 py-3 text-[#94a3b8]">Root Cause</td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-1 w-16 overflow-hidden rounded bg-[#1e1b2e]"><div className="science-bar-anim h-full w-[91%] bg-[#ff4fd8]" /></div>
                          <span className="science-mono text-[#ff4fd8]">0.91</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="science-mono flex items-center justify-between border-t border-white/10 bg-black/40 px-5 py-2 text-[10px] text-[#94a3b8]">
                  <span>DATASET: SYS_OPT_24</span>
                  <div className="flex gap-4">
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#3be1f7] text-[#3be1f7]" />Speed</span>
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#8b5cf6] text-[#8b5cf6]" />Quality</span>
                    <span className="inline-flex items-center gap-1"><Circle className="h-2.5 w-2.5 fill-[#ff4fd8] text-[#ff4fd8]" />Cost</span>
                  </div>
                </div>
              </div>

              <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-[#94a3b8]">
                A metodologia <span className="font-medium text-white">Kanban</span> (destacada acima) otimiza a
                <span className="italic text-[#3be1f7]"> visibilidade do fluxo</span>, mas frequentemente sacrifica a
                captura de detalhes granulares.
              </p>
            </div>
          </div>

          <aside className="science-grid relative hidden h-screen overflow-hidden border-l border-[#283739]/50 lg:sticky lg:top-0 lg:flex lg:w-[45%] lg:items-center lg:justify-center">
            <div className="science-scanline" />
            <div className="relative z-10 h-[430px] w-[430px]">
              <div className="science-mono absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-widest text-[#3be1f7]">SPEED</div>
              <div className="science-mono absolute -bottom-6 right-[13%] text-[11px] font-bold tracking-widest text-[#8b5cf6]">QUALITY</div>
              <div className="science-mono absolute -bottom-6 left-[13%] text-[11px] font-bold tracking-widest text-[#ff4fd8]">COST</div>
              <svg className="h-full w-full opacity-95" viewBox="0 0 100 100" fill="none">
                <polygon points="50,10 90,80 10,80" stroke="#283739" strokeWidth="0.5" />
                <polygon points="50,27.5 70,62.5 30,62.5" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="10" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="90" y2="80" stroke="#283739" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="10" y2="80" stroke="#283739" strokeWidth="0.5" />
                <polygon className="science-radar-pulse" points="50,25 80,70 30,75" fill="url(#scienceGradient)" stroke="#3be1f7" strokeWidth="1" />
                <circle className="science-dot-twinkle" cx="50" cy="25" r="1.4" fill="#fff" />
                <circle className="science-dot-twinkle" cx="80" cy="70" r="1.4" fill="#fff" />
                <circle className="science-dot-twinkle" cx="30" cy="75" r="1.4" fill="#fff" />
                <defs>
                  <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3be1f7" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.65" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="science-mono absolute left-[56%] top-[18%] rounded border border-[#3be1f7]/40 bg-black/80 px-2 py-1 text-[10px] text-[#3be1f7]">
                High Vel.
              </div>
              <div className="science-mono absolute bottom-[21%] right-[4%] rounded border border-[#8b5cf6]/40 bg-black/80 px-2 py-1 text-[10px] text-[#8b5cf6]">
                Med Qual.
              </div>
            </div>
            <div className="science-mono absolute bottom-12 right-12 text-right text-[10px]">
              <p className="mb-1 text-[#3be1f7]/55">VISUALIZER_STATE</p>
              <p className="text-white">SYNCED: KANBAN</p>
            </div>
          </aside>
        </section>

        <section className="science-grid relative border-b border-white/5 px-6 py-24 md:px-12">
          <div className="mx-auto w-full max-w-[800px]">
            <header className="relative mb-14 text-center">
              <h2 className="science-mono science-cyan-glow text-4xl font-bold uppercase tracking-[0.14em] text-white md:text-6xl">
                SAÍDA_FINAL //
              </h2>
              <p className="science-mono mt-3 text-xs uppercase tracking-[0.2em] text-[#3be1f7]/80">ID DO LOG DA SESSÃO: #88X-GAMMA</p>
            </header>

            <section className="mb-12 rounded border border-dashed border-[#ff4fd8] bg-[#120b1f]/60 p-8 shadow-[0_0_8px_rgba(255,79,216,0.2)] md:p-10">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="rounded-full bg-[#ff4fd8]/15 p-3 text-[#ff4fd8]">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="science-mono rounded border border-[#ff4fd8] bg-[#ff4fd8]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff4fd8]">
                      PRO TIP_LOG
                    </span>
                    <span className="h-px w-10 bg-[#ff4fd8]/35" />
                  </div>
                  <h3 className="science-mono text-3xl font-bold uppercase tracking-wide text-white">ESTRATÉGIA_DE_OTIMIZAÇÃO</h3>
                  <p className="mt-4 max-w-xl text-2xl leading-relaxed text-[#cbd5e1]">
                    Para vender esta metodologia aos stakeholders, foque em{' '}
                    <span className="font-semibold italic text-[#ff4fd8]">‘Redução de Risco’ (MASP)</span> em vez de{' '}
                    <span className="font-semibold italic text-[#3be1f7]">‘Velocidade’ (Kanban)</span>.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <div className="mb-4 flex items-center gap-3">
                <TerminalSquare className="h-4 w-4 text-[#3be1f7]" />
                <h3 className="science-mono text-xl uppercase tracking-[0.18em] text-[#3be1f7]">LOG_DE_REFERÊNCIA</h3>
                <div className="h-px flex-grow bg-gradient-to-r from-[#3be1f7]/30 to-transparent" />
              </div>
              <div className="science-mono text-xl">
                <a href="#" className="group flex items-center justify-between border-l-2 border-transparent px-3 py-3 text-[#94a3b8] transition-all duration-280 hover:border-[#3be1f7] hover:bg-[#1e1b2e]/55 hover:pl-4">
                  <span><span className="text-[#3be1f7]/70">[REF-01]</span> <span className="ml-2 font-bold text-[#3be1f7]">GTD: The Art of Stress-Free Productivity</span></span>
                  <span className="text-xs text-[#94a3b8]/65">SRC: David Allen Co.</span>
                </a>
                <a href="#" className="group flex items-center justify-between border-l-2 border-transparent px-3 py-3 text-[#94a3b8] transition-all duration-280 hover:border-[#3be1f7] hover:bg-[#1e1b2e]/55 hover:pl-4">
                  <span><span className="text-[#3be1f7]/70">[REF-02]</span> <span className="ml-2 font-bold text-[#3be1f7]">Kanban: Successful Evolutionary Change</span></span>
                  <span className="text-xs text-[#94a3b8]/65">SRC: David J. Anderson</span>
                </a>
                <a href="#" className="group flex items-center justify-between border-l-2 border-transparent px-3 py-3 text-[#94a3b8] transition-all duration-280 hover:border-[#3be1f7] hover:bg-[#1e1b2e]/55 hover:pl-4">
                  <span><span className="text-[#3be1f7]/70">[REF-03]</span> <span className="ml-2 font-bold text-[#3be1f7]">The Toyota Way (Lean Principles)</span></span>
                  <span className="text-xs text-[#94a3b8]/65">SRC: Jeffrey Liker</span>
                </a>
                <a href="#" className="group flex items-center justify-between border-l-2 border-transparent px-3 py-3 text-[#94a3b8] transition-all duration-280 hover:border-[#3be1f7] hover:bg-[#1e1b2e]/55 hover:pl-4">
                  <span><span className="text-[#3be1f7]/70">[REF-04]</span> <span className="ml-2 font-bold text-[#3be1f7]">Atomic Habits: Tiny Changes</span></span>
                  <span className="text-xs text-[#94a3b8]/65">SRC: James Clear</span>
                </a>
              </div>
            </section>

            <section className="border-t border-white/5 pt-12 text-center">
              <button className="science-mono group inline-flex items-center gap-3 border border-[#3be1f7] px-10 py-4 text-xl font-bold uppercase tracking-[0.14em] text-[#3be1f7] transition hover:bg-[#3be1f7]/10">
                <RefreshCw className="h-5 w-5 transition-transform duration-650 group-hover:rotate-180" />
                ACESSAR SISTEMA
              </button>
              <div className="science-mono mt-8 space-y-2 text-xs">
                <p className="text-[#94a3b8]"><span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle" /> <span className="ml-2">V2.4.0 // SYS_READY</span></p>
                <p className="text-[#64748b]">© 2024 ScienceLab. All systems operational.</p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Ciencia
